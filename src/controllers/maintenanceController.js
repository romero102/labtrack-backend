import Maintenance from "../models/Maintenance.js";

//  Crear mantenimiento
export const createMaintenance = async (req, res) => {
  try {
    const { computer, category, nature, description, findings, status} = req.body;

    const foundComputer = await Computer.findById(computer);
    if (!foundComputer) {
      return res.status(404).json({ message: "Computer not found" });
    }

    // Admin puede todo
    if (req.user.role !== "admin") {

      const user = await User.findById(req.user.id);

      const isAssigned = user.labs.includes(foundComputer.lab);

      if (!isAssigned) {
        return res.status(403).json({
          message: "You can only create maintenance for computers in your assigned labs"
        });
      }
    }

    const maintenance = new Maintenance({ computer, technician: req.user.id, category, nature, description, findings, status });

    await maintenance.save();
    res.status(201).json(maintenance);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Obtener todos los mantenimientos
export const getAllMaintenances = async (req, res) => {
  try {
    const maintenances = await Maintenance.find()
      .populate("computer", "name serialNumber")
      .populate("technician", "name email");

    res.json(maintenances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Obtener mantenimiento por ID
export const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id)
      .populate("computer", "name serialNumber")
      .populate("technician", "name email");

    if (!maintenance)
      return res.status(404).json({ message: "Maintenance not found" });

    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Actualizar mantenimiento
export const updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!maintenance)
      return res.status(404).json({ message: "Maintenance not found" });

    res.json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Eliminar mantenimiento
export const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);

    if (!maintenance)
      return res.status(404).json({ message: "Maintenance not found" });

    res.json({ message: "Maintenance deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};