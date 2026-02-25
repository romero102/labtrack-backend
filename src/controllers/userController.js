import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//  Crear usuario
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, labs } = req.body;

    // Verificar si ya existe el email
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    //  Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role, 
      labs 
    });

    await user.save();
    res.status(201).json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("labs", "name location");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("labs", "name location");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("labs", "name location");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //  Buscar usuario
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    //  Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    //  Generar token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};