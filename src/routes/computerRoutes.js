import express from "express";
import { createComputer, getAllComputers, getComputerById, updateComputer, deleteComputer } from "../controllers/computerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Rutas de CRUD
router.post("/", protect, authorizeRoles("admin"), createComputer);         
router.get("/", protect, authorizeRoles("admin", "technician"), getAllComputers);        
router.get("/:id", protect, authorizeRoles("admin", "technician"), getComputerById);     
router.put("/:id", protect, authorizeRoles("admin"), updateComputer);     
router.delete("/:id", protect, authorizeRoles("admin"), deleteComputer);  

export default router;