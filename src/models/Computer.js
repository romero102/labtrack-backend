import mongoose from "mongoose";

const computerSchema = new mongoose.Schema({
  lab: { type: mongoose.Schema.Types.ObjectId, ref: "Laboratory", required: true },
  qrImage: { type: String, required: true, unique: true },
  qrPublicId: { type: String, required: true, unique: true },
  processor: { type: String, required: true },
  ram: { type: String, required: true },
  storage: { type: String, required: true },
  graphics: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Computer", computerSchema);