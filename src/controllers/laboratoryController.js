import Laboratory from "../models/Laboratory.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Crear un laboratorio
export const createLaboratory = asyncHandler( async (req, res) => {
  
    const { name, location, computerCount } = req.body;

    const existingLab = await Laboratory.findOne({ name });

    if (existingLab) {
      const error = new Error("Laboratory already exists");
      error.statusCode = 400;
      throw error;
    }

    const lab = new Laboratory({ name, location, computerCount });
    await lab.save();

    res.status(201).json({
      success: true,
      data: lab
    });
  
});

//  Obtener todos los laboratorios
export const getAllLaboratories = asyncHandler( async (req, res) => {

    const labs = await Laboratory.find();

    res.status(200).json({
      success: true,
      data: labs
    });
  
});

//  Obtener un laboratorio por ID
export const getLaboratoryById = asyncHandler( async (req, res) => {
  
    const lab = await Laboratory.findById(req.params.id);
    if (!lab){
      const error = new Error("Laboratory not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: lab
    });

});

//  Actualizar un laboratorio
export const updateLaboratory = asyncHandler( async (req, res) => {
    const lab = await Laboratory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lab){
      const error = new Error("Laboratory not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: lab
    });
});

//  Eliminar un laboratorio
export const deleteLaboratory = asyncHandler(async (req, res) => {
  
    const lab = await Laboratory.findByIdAndDelete(req.params.id);
    if (!lab){
      const error = new Error("Laboratory not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
    success: true,
    message: "Laboratory deleted successfully"
    });
  
});