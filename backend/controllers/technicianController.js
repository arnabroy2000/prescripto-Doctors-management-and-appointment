import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import technicianModel from "../models/technicianModel.js";
import userModel from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

// Technician Login
const loginTechnician = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tech = await technicianModel.findOne({ email });

    if (!tech || !(await bcrypt.compare(password, tech.password))) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(tech._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Technician Profile
const technicianProfile = async (req, res) => {
  try {
    const { technicianId } = req.body;
    const tech = await technicianModel
      .findById(technicianId)
      .select("-password");

    if (!tech) {
      return res.json({ success: false, message: "Technician not found" });
    }

    res.json({ success: true, technician: tech });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update Technician Profile
const updateTechnicianProfile = async (req, res) => {
  try {
    const { technicianId, address, available, department, skills } = req.body;

    await technicianModel.findByIdAndUpdate(technicianId, {
      address,
      available,
      department,
      skills,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin Panel: Add Technician
const addTechnician = async (req, res) => {
  try {
    const { name, email, password, department, experience, skills, address } =
      req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !department ||
      !experience ||
      !skills ||
      !address ||
      !imageFile
    ) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const existingTech = await technicianModel.findOne({ email });
    if (existingTech) {
      return res.json({ success: false, message: "Technician already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const newTech = new technicianModel({
      name,
      email,
      password: hashedPassword,
      image: uploadResult.secure_url,
      department,
      experience,
      skills: JSON.parse(skills),
      address: JSON.parse(address),
      available: true,
      date: Date.now(),
    });

    await newTech.save();

    res.json({ success: true, message: "Technician Added Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin Panel: Get All Technicians
const allTechnicians = async (req, res) => {
  try {
    const technicians = await technicianModel.find({}).select("-password");
    res.json({ success: true, technicians });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin Panel: Change Availability
const changeAvailablity = async (req, res) => {
  try {
    const { technicianId } = req.body;
    const tech = await technicianModel.findById(technicianId);

    if (!tech) {
      return res.json({ success: false, message: "Technician not found" });
    }

    await technicianModel.findByIdAndUpdate(technicianId, {
      available: !tech.available,
    });

    res.json({ success: true, message: "Availability updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// List Tests assigned to Technician
const listAssignedTests = async (req, res) => {
  try {
    const { technicianId } = req.body;

    const users = await userModel.find({ "tests.technicianId": technicianId });

    let assignedTests = [];

    users.forEach((user) => {
      user.tests.forEach((test) => {
        if (test.technicianId.toString() === technicianId) {
          assignedTests.push({
            _id: test._id,
            userId: user._id,
            userName: user.name,
            userEmail: user.email,
            testName: test.testName,
            testDate: test.testDate,
            status: test.status,
            reportUrl: test.reportUrl || null,
          });
        }
      });
    });

    res.json({ success: true, assignedTests });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Upload/Submit Test Report
const uploadTestReport = async (req, res) => {
  try {
    const {
      testId,
      chronicConditions = [],
      allergies = [],
      surgeries = [],
      medications = [],
      remarks = "",
    } = req.body;

    // Find user who has this test
    const user = await userModel.findOne({ "tests._id": testId });

    if (!user) {
      return res.json({ success: false, message: "User or Test not found" });
    }

    // Update the specific test
    user.tests = user.tests.map((test) => {
      if (test._id.toString() === testId) {
        return {
          ...test.toObject(),
          status: "Completed",
          remarks,
        };
      }
      return test;
    });

    // Ensure medicalHistory exists
    if (!user.medicalHistory) {
      user.medicalHistory = {
        chronicConditions: [],
        allergies: [],
        surgeries: [],
        medications: [],
      };
    }

    // Merge new data without duplicates
    const addUnique = (oldArray, newArray) => {
      newArray.forEach((item) => {
        if (!oldArray.includes(item)) {
          oldArray.push(item);
        }
      });
    };

    addUnique(user.medicalHistory.chronicConditions, chronicConditions);
    addUnique(user.medicalHistory.allergies, allergies);
    addUnique(user.medicalHistory.surgeries, surgeries);
    addUnique(user.medicalHistory.medications, medications);

    await user.save();

    res.json({
      success: true,
      message: "Test Report Submitted and User Updated",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginTechnician,
  technicianProfile,
  updateTechnicianProfile,
  addTechnician,
  allTechnicians,
  changeAvailablity,
  listAssignedTests,
  uploadTestReport,
};
