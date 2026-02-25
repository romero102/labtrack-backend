import express from "express";
import { createLaboratory, getAllLaboratories, getLaboratoryById, updateLaboratory, deleteLaboratory } from "../controllers/laboratoryController.js";

const router = express.Router();

// Rutas
router.post("/", createLaboratory);         
router.get("/", getAllLaboratories);     
router.get("/:id", getLaboratoryById);     
router.put("/:id", updateLaboratory);      
router.delete("/:id", deleteLaboratory);   

export default router;