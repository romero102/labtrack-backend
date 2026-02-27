import Computer from "../models/Computer.js";
import QRCode from "qrcode";
import cloudinary from "../config/cloudinary.js";

//  Crear una computadora
export const createComputer = async (req, res) => {
  try {
    const { lab, processor, ram, storage, graphics } = req.body;

    //  Crear instancia SIN guardar todavía
    const computer = new Computer({
      lab,
      processor,
      ram,
      storage,
      graphics
    });

    //  Generar la URL que contendrá el QR
    const qrData = `${process.env.BASE_URL}/api/computers/${computer._id}`;

    //  Generar imagen QR en base64
    const qrImageBase64 = await QRCode.toDataURL(qrData);

    //  Subir imagen a Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(qrImageBase64, {
      folder: "labtrack_qr_codes"
    });

    //  Guardar URL en el modelo
    computer.qrImage = uploadResponse.secure_url;

    //  Ahora sí guardamos en MongoDB
    await computer.save();

    res.status(201).json(computer);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error creating computer",
      error: error.message
    });
  }
};

//  Obtener todas las computadoras
export const getAllComputers = async (req, res) => {
  try {
    const computers = await Computer.find().populate("lab");
    res.json(computers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Obtener una computadora por ID
export const getComputerById = async (req, res) => {
  try {
    const computer = await Computer.findById(req.params.id).populate("lab");
    if (!computer) return res.status(404).json({ message: "Computer not found" });
    res.json(computer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Actualizar una computadora
export const updateComputer = async (req, res) => {
  try {
    const computer = await Computer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!computer) return res.status(404).json({ message: "Computer not found" });
    res.json(computer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Eliminar una computadora
export const deleteComputer = async (req, res) => {
  try {
    const computer = await Computer.findByIdAndDelete(req.params.id);
    if (!computer) return res.status(404).json({ message: "Computer not found" });
    res.json({ message: "Computer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};