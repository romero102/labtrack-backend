import express from "express";
import { createComputer, getAllComputers, getComputerById, updateComputer, deleteComputer } from "../controllers/computerController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { createComputerValidator } from "../validators/createComputerValidator.js";
import { updateComputerValidator } from "../validators/updateComputerValidator.js";
import { validate } from "../middleware/validationMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

// Rutas de CRUD
router.post("/", protect, authorizeRoles("admin"), createComputerValidator, validate, createComputer);         
router.get("/", protect, authorizeRoles("admin", "technician"), getAllComputers);        
router.get("/:id", protect, authorizeRoles("admin", "technician"), validateObjectId, getComputerById);     
router.put("/:id", protect, authorizeRoles("admin"), updateComputerValidator, validateObjectId, validate, updateComputer);     
router.delete("/:id", protect, authorizeRoles("admin"), validateObjectId, deleteComputer);  

export default router;