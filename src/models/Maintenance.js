import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema({
  computer: { type: mongoose.Schema.Types.ObjectId, ref: "Computer", required: true },
  technician: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, enum: ["physical", "logical"], required: true },
  nature: { type: String, enum: ["preventive", "corrective"], required: true },
  description: { type: String, required: true },
  findings: { type: String },
  status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" }

}, { timestamps: true });

export default mongoose.model("Maintenance", maintenanceSchema);