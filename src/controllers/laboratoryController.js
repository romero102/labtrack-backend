import Laboratory from "../models/Laboratory.js";

// Crear un laboratorio
export const createLaboratory = async (req, res) => {
  try {
    const { name, location, computerCount } = req.body;

    const lab = new Laboratory({ name, location, computerCount });
    await lab.save();

    res.status(201).json(lab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Obtener todos los laboratorios
export const getAllLaboratories = async (req, res) => {
  try {
    const labs = await Laboratory.find();
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Obtener un laboratorio por ID
export const getLaboratoryById = async (req, res) => {
  try {
    const lab = await Laboratory.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: "Laboratory not found" });
    res.json(lab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Actualizar un laboratorio
export const updateLaboratory = async (req, res) => {
  try {
    const lab = await Laboratory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lab) return res.status(404).json({ message: "Laboratory not found" });
    res.json(lab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Eliminar un laboratorio
export const deleteLaboratory = async (req, res) => {
  try {
    const lab = await Laboratory.findByIdAndDelete(req.params.id);
    if (!lab) return res.status(404).json({ message: "Laboratory not found" });
    res.json({ message: "Laboratory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};