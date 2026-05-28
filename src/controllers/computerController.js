import Computer from "../models/Computer.js";
import Laboratory from "../models/Laboratory.js"
import QRCode from "qrcode";
import cloudinary from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

//  Crear una computadora
export const createComputer = asyncHandler(async (req, res) => {
  const { code, lab, processor, ram, storage, graphics } = req.body;

  const existingComputer = await Computer.findOne({ code });
      if (existingComputer) {
        const error = new Error("Code already exists");
        error.statusCode = 400;
        throw error;
      }

  const existingLaboratory = await Laboratory.findById(lab);
      if (existingComputer) {
        const error = new Error("Code already exists");
        error.statusCode = 400;
        throw error;
      }

  // Crear instancia sin guardar
  const computer = new Computer({
    code,
    lab: existingLaboratory._id,
    processor,
    ram,
    storage,
    graphics
  });

  const qrData = `${process.env.FRONTEND_URL}/maintenance${computer._id}`;

  let uploadResponse; // la declaramos fuera para poder usarla en catch

  try {
    //  Generar QR
    const qrImageBase64 = await QRCode.toDataURL(qrData);

    //  Subir a Cloudinary
    uploadResponse = await cloudinary.uploader.upload(qrImageBase64, {
      folder: "labtrack_qr_codes"
    });

    //  Guardar datos en el modelo
    computer.qrImage = uploadResponse.secure_url;
    computer.qrPublicId = uploadResponse.public_id;

    //  Guardar en Mongo
    await computer.save();

    res.status(201).json({
      success: true,
      data: computer
    });

  } catch (error) {

    //  Si ya se subió la imagen pero Mongo falló
    if (uploadResponse?.public_id) {
      await cloudinary.uploader.destroy(uploadResponse.public_id);
    }

    throw error; // lo enviamos a asyncHandler
  }
});

//  Obtener todas las computadoras
export const getAllComputers = asyncHandler( async (req, res) => {
  const computers = await Computer.find().populate("lab", "name").lean();

  res.status(200).json({
    success: true,
    data: computers
  });
});

//  Obtener una computadora por ID
export const getComputerById = asyncHandler(async (req, res) => {
    const computer = await Computer.findById(req.params.id).populate("lab");
    if (!computer){
      const error = new Error("Computer not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
    success: true,
    data: computer
    });
});

// Obtener computadoras por laboratorio
export const getComputersByLab = asyncHandler(async (req, res) => {

  const computers = await Computer.find({
    lab: req.params.id,
  }).populate("lab", "name");

  res.status(200).json({
    success: true,
    data: computers,
  });
});

//  Actualizar una computadora
export const updateComputer = asyncHandler(async (req, res) => {

  const allowedFields = ["lab","processor", "ram", "storage", "graphics"];
  const updates = {};

  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const computer = await Computer.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  if (!computer) {
    const error = new Error("Computer not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: computer
  });

});

//  Eliminar una computadora
export const deleteComputer = asyncHandler( async (req, res) => {
  
    const { id } = req.params;

    const computer = await Computer.findById(id);

    if (!computer) {
      const error = new Error("Computer not found");
      error.statusCode = 404;
      throw error;
    }

    //  Eliminar QR de Cloudinary si existe
    if (computer.qrPublicId) {
      await cloudinary.uploader.destroy(computer.qrPublicId);
    }

    //  Eliminar computadora de MongoDB
    await computer.deleteOne();
    
    res.status(200).json({
    success: true,
    message: "Computer deleted successfully"
  });

});