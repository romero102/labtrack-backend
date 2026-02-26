import express from "express";
import { createLaboratory, getAllLaboratories, getLaboratoryById, updateLaboratory, deleteLaboratory } from "../controllers/laboratoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Rutas
router.post("/", protect, authorizeRoles("admin"), createLaboratory);         
router.get("/", protect, authorizeRoles("admin", "technician"), getAllLaboratories);     
router.get("/:id", protect, authorizeRoles("admin", "technician"), getLaboratoryById);     
router.put("/:id", protect, authorizeRoles("admin"), updateLaboratory);      
router.delete("/:id", protect, authorizeRoles("admin"), deleteLaboratory);   

export default router;