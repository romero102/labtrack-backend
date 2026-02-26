import Maintenance from "../models/Maintenance.js";

export const checkMaintenanceOwnership = async (req, res, next) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance not found" });
    }

    // Admin puede todo
    if (req.user.role === "admin") {
      return next();
    }

    // Técnico solo si es suyo
    if (maintenance.technician.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    next();

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};