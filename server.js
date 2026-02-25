import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import laboratoryRoutes from "./src/routes/laboratoryRoutes.js";
import computerRoutes from "./src/routes/computerRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import maintenanceRoutes from "./src/routes/maintenanceRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/labs", laboratoryRoutes);
app.use("/api/computers", computerRoutes);
app.use("/api/users", userRoutes);
app.use("/api/maintenances", maintenanceRoutes);

app.get("/", (req, res) => {
  res.json({ message: "LabTrack API running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});