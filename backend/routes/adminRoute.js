import express from "express";
import {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
  addNurse,
  allNurses,
  addTechnician,
  allTechnicians,
} from "../controllers/adminController.js";

import { changeAvailablity as changeDoctorAvailability } from "../controllers/doctorController.js";
import { changeAvailablity as changeNurseAvailability } from "../controllers/nurseController.js";
import { changeAvailablity as changeTechnicianAvailability } from "../controllers/technicianController.js";

import {
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  listInventoryItems,
} from "../controllers/inventoryController.js";

import authAdmin from "../middleware/authAdmin.js";
import upload from "../middleware/multer.js";

const adminRouter = express.Router();

// Admin Login
adminRouter.post("/login", loginAdmin);

// Doctor Routes
adminRouter.post("/add-doctor", authAdmin, upload.single("image"), addDoctor);
adminRouter.get("/all-doctors", authAdmin, allDoctors);
adminRouter.post(
  "/change-doctor-availability",
  authAdmin,
  changeDoctorAvailability
);

// Nurse Routes
adminRouter.post("/add-nurse", authAdmin, upload.single("image"), addNurse);
adminRouter.get("/all-nurses", authAdmin, allNurses);
adminRouter.post(
  "/change-nurse-availability",
  authAdmin,
  changeNurseAvailability
);

// Technician Routes
adminRouter.post(
  "/add-technician",
  authAdmin,
  upload.single("image"),
  addTechnician
);
adminRouter.get("/all-technicians", authAdmin, allTechnicians);
adminRouter.post(
  "/change-technician-availability",
  authAdmin,
  changeTechnicianAvailability
);

// Appointments
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);

// Dashboard
adminRouter.get("/dashboard", authAdmin, adminDashboard);

// Inventory (Medication, Consumables, Equipment Management)
adminRouter.post("/inventory/add", authAdmin, addInventoryItem);
adminRouter.put("/inventory/update/:id", authAdmin, updateInventoryItem);
adminRouter.delete("/inventory/delete/:id", authAdmin, deleteInventoryItem);
adminRouter.get("/inventory/list", authAdmin, listInventoryItems);

export default adminRouter;
