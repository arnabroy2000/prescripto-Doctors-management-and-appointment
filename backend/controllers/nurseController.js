import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nurseModel from "../models/nurseModel.js";
import { v2 as cloudinary } from "cloudinary";

// Generate JWT token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET);

// Nurse Login (for Nurse Panel)
const loginNurse = async (req, res) => {
  try {
    const { email, password } = req.body;
    const nurse = await nurseModel.findOne({ email });

    if (!nurse || !(await bcrypt.compare(password, nurse.password))) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(nurse._id);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Nurse Profile (for Nurse Panel)
const nurseProfile = async (req, res) => {
  try {
    const { nurseId } = req.body;
    const nurse = await nurseModel.findById(nurseId).select("-password");

    if (!nurse) {
      return res.json({ success: false, message: "Nurse not found" });
    }

    res.json({ success: true, nurse });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update Nurse Profile (for Nurse Panel)
const updateNurseProfile = async (req, res) => {
  try {
    const { nurseId, address, available, speciality } = req.body;

    await nurseModel.findByIdAndUpdate(nurseId, {
      address,
      available,
      speciality,
    });

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin Panel - Add Nurse
const addNurse = async (req, res) => {
  try {
    const { name, email, password, speciality, experience, address } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !experience ||
      !address ||
      !imageFile
    ) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const existingNurse = await nurseModel.findOne({ email });
    if (existingNurse) {
      return res.json({ success: false, message: "Nurse already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const nurseData = new nurseModel({
      name,
      email,
      password: hashedPassword,
      image: uploadResult.secure_url,
      speciality,
      experience,
      address: JSON.parse(address),
      available: true,
      date: Date.now(),
    });

    await nurseData.save();

    res.json({ success: true, message: "Nurse Added Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin Panel - Get All Nurses
const allNurses = async (req, res) => {
  try {
    const nurses = await nurseModel.find({}).select("-password");
    res.json({ success: true, nurses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Admin Panel - Change Nurse Availability
const changeAvailablity = async (req, res) => {
  try {
    const { nurseId } = req.body;
    const nurse = await nurseModel.findById(nurseId);

    if (!nurse) {
      return res.json({ success: false, message: "Nurse not found" });
    }

    await nurseModel.findByIdAndUpdate(nurseId, {
      available: !nurse.available,
    });

    res.json({ success: true, message: "Availability updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  loginNurse,
  nurseProfile,
  updateNurseProfile,
  addNurse,
  allNurses,
  changeAvailablity,
};
