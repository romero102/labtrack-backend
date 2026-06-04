import Laboratory from "../models/Laboratory.js";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Computer from "../models/Computer.js";

// Crear un laboratorio
export const createLaboratory = asyncHandler(async (req, res) => {
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
    data: lab,
  });
});

//  Obtener todos los laboratorios
export const getAllLaboratories = asyncHandler(async (req, res) => {
  const labs = await Laboratory.find();

  res.status(200).json({
    success: true,
    data: labs,
  });
});

//  Obtener un laboratorio por ID
export const getLaboratoryById = asyncHandler(async (req, res) => {
  const lab = await Laboratory.findById(req.params.id);
  if (!lab) {
    const error = new Error("Laboratory not found");
    error.statusCode = 404;
    throw error;
  }
  res.status(200).json({
    success: true,
    data: lab,
  });
});

export const getMyLaboratories = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate("labs");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    data: user.labs,
  });
});

//  Actualizar un laboratorio
export const updateLaboratory = asyncHandler(async (req, res) => {
  const lab = await Laboratory.findById(req.params.id);

  if (!lab) {
    const error = new Error("Laboratory not found");
    error.statusCode = 404;
    throw error;
  }

  Object.assign(lab, req.body);

  await lab.save();

  res.status(200).json({
    success: true,
    data: lab,
  });
});

//  Eliminar un laboratorio
export const deleteLaboratory = asyncHandler(async (req, res) => {
  const lab = await Laboratory.findById(req.params.id);

  if (!lab) {
    const error = new Error("Laboratory not found");
    error.statusCode = 404;
    throw error;
  }

  await lab.deleteOne();

  await Computer.deleteMany({
    lab: req.params.id,
  });

  await User.updateMany(
    { labs: req.params.id },
    { $pull: { labs: req.params.id } },
  );

  res.status(200).json({
    success: true,
    message: "Laboratory deleted successfully",
  });
});
