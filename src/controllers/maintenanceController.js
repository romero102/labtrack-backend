import Maintenance from "../models/Maintenance.js";
import Computer from "../models/Computer.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//  Crear mantenimiento
export const createMaintenance = asyncHandler( async (req, res) => {

    const { computer, category, nature, description, findings, status} = req.body;

    const foundComputer = await Computer.findById(computer);
    if (!foundComputer) {
      const error = new Error("Computer not found");
      error.statusCode = 404;
      throw error;
    }

    // Admin puede todo
    if (req.user.role !== "admin") {

      const user = await User.findById(req.user.id);

      if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }

      const isAssigned = user.labs.includes(foundComputer.lab);

      if (!isAssigned) {
        const error = new Error("You can only create maintenance for computers in your assigned labs");
        error.statusCode = 403;
        throw error;
      }
    }

    const maintenance = new Maintenance({ computer, technician: req.user.id, category, nature, description, findings, status });

    await maintenance.save();
    
    res.status(201).json({
      success: true,
      data: maintenance
    });

});

//  Obtener todos los mantenimientos
export const getAllMaintenances = asyncHandler( async (req, res) => {

    const maintenances = await Maintenance.find()
      .populate("computer", "name serialNumber")
      .populate("technician", "name email");

    res.status(200).json({
      success: true,
      data: maintenances
    });
});

//  Obtener mantenimiento por ID
export const getMaintenanceById = asyncHandler( async (req, res) => {
  
    const maintenance = await Maintenance.findById(req.params.id)
      .populate("computer", "name serialNumber")
      .populate("technician", "name email");

    if (!maintenance){
      const error = new Error("Maintenance not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: maintenance
    });
});

//  Actualizar mantenimiento
export const updateMaintenance = asyncHandler( async (req, res) => {
  
    const maintenance = await Maintenance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
    );

    if (!maintenance){
      const error = new Error("Maintenance not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: maintenance
    });
});

//  Eliminar mantenimiento
export const deleteMaintenance = asyncHandler( async (req, res) => {
  
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);

    if (!maintenance){
      const error = new Error("Maintenance not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
    success: true,
    message: "Maintenance deleted successfully"
    });

});