import express from "express";
import {
  loginNurse,
  nurseProfile,
  updateNurseProfile,
} from "../controllers/nurseController.js";

import authNurse from "../middleware/authNurse.js";
import {
  addInventoryItem,
  deleteInventoryItem,
  listInventoryItems,
  updateInventoryItem,
} from "../controllers/inventoryController.js";

const nurseRouter = express.Router();

// Nurse Login
nurseRouter.post("/login", loginNurse);

// Nurse Profile
nurseRouter.get("/profile", authNurse, nurseProfile);
nurseRouter.post("/update-profile", authNurse, updateNurseProfile);

// Inventory (Medication, Consumables, Equipment Management)
nurseRouter.post("/inventory/add", authNurse, addInventoryItem);
nurseRouter.put("/inventory/update/:id", authNurse, updateInventoryItem);
nurseRouter.delete("/inventory/delete/:id", authNurse, deleteInventoryItem);
nurseRouter.get("/inventory/list", authNurse, listInventoryItems);

export default nurseRouter;
