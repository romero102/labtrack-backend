import express from "express";
import {
  createComputer, getAllComputers, getComputerById, updateComputer, deleteComputer } from "../controllers/computerController.js";

const router = express.Router();

// Rutas de CRUD
router.post("/", createComputer);         
router.get("/", getAllComputers);        
router.get("/:id", getComputerById);     
router.put("/:id", updateComputer);     
router.delete("/:id", deleteComputer);  

export default router;