import express from "express";
import { createMaintenance, getAllMaintenances, getMaintenanceById ,updateMaintenance, deleteMaintenance } from "../controllers/maintenanceController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { checkMaintenanceOwnership } from "../middleware/maintenanceOwnership.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { validate } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("admin", "technician"),validate, createMaintenance);
router.get("/", protect, authorizeRoles("admin", "technician"), getAllMaintenances);
router.get("/:id", protect, authorizeRoles("admin", "technician"), validateObjectId, getMaintenanceById);
router.put("/:id", protect, authorizeRoles("admin", "technician"), checkMaintenanceOwnership, validateObjectId, validate,updateMaintenance);
router.delete("/:id", protect, authorizeRoles("admin", "technician"), checkMaintenanceOwnership, validateObjectId, deleteMaintenance);

export default router;