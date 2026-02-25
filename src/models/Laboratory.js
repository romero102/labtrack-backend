import mongoose from "mongoose";

const laboratorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  computerCount: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Laboratory", laboratorySchema);