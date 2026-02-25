import express from "express";
import { createMaintenance, getAllMaintenances, getMaintenanceById ,updateMaintenance, deleteMaintenance } from "../controllers/maintenanceController.js";

const router = express.Router();

router.post("/", createMaintenance);
router.get("/", getAllMaintenances);
router.get("/:id", getMaintenanceById);
router.put("/:id", updateMaintenance);
router.delete("/:id", deleteMaintenance);

export default router;