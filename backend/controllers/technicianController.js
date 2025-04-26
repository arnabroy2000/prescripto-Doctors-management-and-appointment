import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import technicianModel from "../models/technicianModel.js";
import { v2 as cloudinary } from "cloudinary";

// Generate JWT token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

// Technician Login (Technician Panel)
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

// Technician Profile (Technician Panel)
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

// Update Technician Profile (Technician Panel)
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

// Admin Panel - Add Technician
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

// Admin Panel - Get All Technicians
const allTechnicians = async (req, res) => {
  try {
    const technicians = await technicianModel.find({}).select("-password");
    res.json({ success: true, technicians });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin Panel - Change Technician Availability
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

export {
  loginTechnician,
  technicianProfile,
  updateTechnicianProfile,
  addTechnician,
  allTechnicians,
  changeAvailablity,
};
