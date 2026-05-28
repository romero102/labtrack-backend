import Maintenance from "../models/Maintenance.js";
import Computer from "../models/Computer.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//  Crear mantenimiento
export const createMaintenance = asyncHandler(async (req, res) => {
  const { computer, category, nature, description, findings, status } =
    req.body;

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
      const error = new Error(
        "You can only create maintenance for computers in your assigned labs",
      );
      error.statusCode = 403;
      throw error;
    }
  }

  const maintenance = new Maintenance({
    computer,
    technician: req.user.id,
    category,
    nature,
    description,
    findings,
    status,
  });

  await maintenance.save();

  res.status(201).json({
    success: true,
    data: maintenance,
  });
});

//  Obtener todos los mantenimientos
export const getAllMaintenance = asyncHandler(async (req, res) => {
  const maintenances = await Maintenance.find()
    .populate({
      path: "computer",
      select: "code lab processor ram storage graphics",
      populate: {
        path: "lab",
        select: "name",
      },
    })
    .populate("technician", "name");

  res.status(200).json({
    success: true,
    data: maintenances,
  });
});

export const getMyMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.find({
    technician: req.user.id,
  })
    .populate("computer", "code lab")
    .populate("technician", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: maintenance,
  });
});

//  Obtener mantenimiento por ID
export const getMaintenanceById = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id)
    .populate("computer", "code")
    .populate("technician", "name");

  if (!maintenance) {
    const error = new Error("Maintenance not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: maintenance,
  });
});

//  Actualizar mantenimiento
export const updateMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id);

  if (!maintenance) {
    const error = new Error("Maintenance not found");
    error.statusCode = 404;
    throw error;
  }

  // autorización
  if (
    req.user.role !== "admin" &&
    maintenance.technician.toString() !== req.user.id
  ) {
    const error = new Error("Unauthorized");
    error.statusCode = 403;
    throw error;
  }

  // actualizar después de autorizar
  Object.assign(maintenance, req.body);

  await maintenance.save();

  res.status(200).json({
    success: true,
    data: maintenance,
  });
});

//  Eliminar mantenimiento
export const deleteMaintenance = asyncHandler(async (req, res) => {
  const maintenance = await Maintenance.findById(req.params.id);

  if (!maintenance) {
    const error = new Error("Maintenance not found");
    error.statusCode = 404;
    throw error;
  }

  // autorización
  if (
    req.user.role !== "admin" &&
    maintenance.technician.toString() !== req.user.id
  ) {
    const error = new Error("Unauthorized");
    error.statusCode = 403;
    throw error;
  }

  await maintenance.deleteOne();

  res.status(200).json({
    success: true,
    message: "Maintenance deleted successfully",
  });
});
