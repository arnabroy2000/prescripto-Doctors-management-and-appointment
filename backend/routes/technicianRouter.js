import express from "express";
import {
  loginTechnician,
  technicianProfile,
  updateTechnicianProfile,
  addTechnician,
  allTechnicians,
  changeAvailablity,
  listAssignedTests,
  uploadTestReport,
} from "../controllers/technicianController.js";
import authTechnician from "../middleware/authTechnician.js"; // ✅ You should have an auth middleware for technician (similar to authUser.js)
import authAdmin from "../middleware/authAdmin.js"; // Admin protected routes
import upload from "../middleware/multer.js"; // For image upload

const technicianRouter = express.Router();

// Technician Panel APIs
technicianRouter.post("/login", loginTechnician);
technicianRouter.get("/profile", authTechnician, technicianProfile);
technicianRouter.post(
  "/update-profile",
  authTechnician,
  updateTechnicianProfile
);

// Admin Panel APIs
technicianRouter.post(
  "/add-technician",
  authAdmin,
  upload.single("image"),
  addTechnician
);
technicianRouter.get("/all-technicians", authAdmin, allTechnicians);
technicianRouter.post("/change-availability", authAdmin, changeAvailablity);

technicianRouter.get("/list-tests", authTechnician, listAssignedTests);
technicianRouter.post(
  "/upload-report",
  authTechnician,
  upload.single("report"),
  uploadTestReport
);

export default technicianRouter;
