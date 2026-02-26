import express from "express";
import { createMaintenance, getAllMaintenances, getMaintenanceById ,updateMaintenance, deleteMaintenance } from "../controllers/maintenanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { checkMaintenanceOwnership } from "../middleware/maintenanceOwnership.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "technician"), createMaintenance);
router.get("/", protect, authorizeRoles("admin", "technician"), getAllMaintenances);
router.get("/:id", protect, authorizeRoles("admin", "technician"), getMaintenanceById);
router.put("/:id", protect, authorizeRoles("admin", "technician"), checkMaintenanceOwnership, updateMaintenance);
router.delete("/:id", protect, authorizeRoles("admin", "technician"), checkMaintenanceOwnership, deleteMaintenance);

export default router;