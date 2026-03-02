import express from "express";
import { createLaboratory, getAllLaboratories, getLaboratoryById, updateLaboratory, deleteLaboratory } from "../controllers/laboratoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createLabValidator } from "../validators/createLabValidator.js";
import { updateLabValidator } from "../validators/updateLabValidator.js";
import { validate } from "../middlewares/validationMiddleware.js";

const router = express.Router();

// Rutas
router.post("/", protect, authorizeRoles("admin"), createLabValidator, validate, createLaboratory);         
router.get("/", protect, authorizeRoles("admin", "technician"), getAllLaboratories);     
router.get("/:id", protect, authorizeRoles("admin", "technician"), getLaboratoryById);     
router.put("/:id", protect, authorizeRoles("admin"), updateLabValidator, validate, updateLaboratory);      
router.delete("/:id", protect, authorizeRoles("admin"), deleteLaboratory);   

export default router;