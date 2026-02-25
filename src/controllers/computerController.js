import Computer from "../models/Computer.js";

//  Crear una computadora
export const createComputer = async (req, res) => {
  try {
    const { lab, codeQR, processor, ram, storage, graphics } = req.body;

    // Verificar si el QR ya existe
    const existing = await Computer.findOne({ codeQR });
    if (existing) {
      return res.status(400).json({ message: "Computer with this QR already exists" });
    }

    const computer = new Computer({ lab, codeQR, processor, ram, storage, graphics });
    await computer.save();

    res.status(201).json(computer);
  } catch (error) {
    res.status(500).json({ message: error.message });
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