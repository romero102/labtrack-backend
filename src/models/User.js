import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "technician"], default: "technician" },
  labs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Laboratory" }] // asignación a laboratorios
}, { timestamps: true });

export default mongoose.model("User", userSchema);