import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ["medication", "consumable", "equipment"],
    required: true,
  },
  quantity: { type: Number, required: true },
  expiryDate: { type: Date },
  storageRequirement: { type: String },
  batchNumber: { type: String },
  serialNumber: { type: String },
  maintenanceSchedule: { type: String },
  addedDate: { type: Date, default: Date.now },
  updatedDate: { type: Date, default: Date.now },
});

const inventoryModel =
  mongoose.models.inventory || mongoose.model("inventory", inventorySchema);

export default inventoryModel;
