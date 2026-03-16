import express from "express";
import { createLaboratory, getAllLaboratories, getLaboratoryById, updateLaboratory, deleteLaboratory } from "../controllers/laboratoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createLabValidator } from "../validators/createLabValidator.js";
import { updateLabValidator } from "../validators/updateLabValidator.js";
import { validate } from "../middleware/validationMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

// Rutas
router.post("/", protect, authorizeRoles("admin"), createLabValidator, validate, createLaboratory);         
router.get("/", protect, authorizeRoles("admin", "technician"), getAllLaboratories);     
router.get("/:id", protect, authorizeRoles("admin", "technician"), validateObjectId, getLaboratoryById);     
router.put("/:id", protect, authorizeRoles("admin"), updateLabValidator,validateObjectId, validate, updateLaboratory);      
router.delete("/:id", protect, authorizeRoles("admin"), validateObjectId, deleteLaboratory);   

export default router;