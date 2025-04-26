import mongoose from "mongoose";

const nurseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    speciality: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String },
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

const nurseModel =
  mongoose.models.nurse || mongoose.model("nurse", nurseSchema);
export default nurseModel;
