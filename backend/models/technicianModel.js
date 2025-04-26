import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    department: { type: String, required: true }, // e.g., Radiology, Lab, etc.
    skills: [{ type: String }],
    experience: { type: String, required: true },
    available: { type: Boolean, default: true },
    assignedDoctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctor",
      default: null,
    },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
  },
  { minimize: false }
);

const technicianModel =
  mongoose.models.technician || mongoose.model("technician", technicianSchema);
export default technicianModel;
