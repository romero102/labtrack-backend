import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

//  Crear usuario
export const createUser = asyncHandler( async (req, res) => {
  
    const { name, email, password, role, labs } = req.body;

    // Verificar si ya existe el email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      throw error;
    }

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
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({
      success: true,
      data: userWithoutPassword
    });

});

//  Obtener todos los usuarios
export const getAllUsers = asyncHandler( async (req, res) => {
  
    const users = await User.find().populate("labs", "name location");

     res.status(200).json({
      success: true,
      data: users
    });
});

//  Obtener usuario por ID
export const getUserById = asyncHandler( async (req, res) => {

    const user = await User.findById(req.params.id).populate("labs", "name location");
    if (!user){
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: user
    });
});

//  Actualizar usuario
export const updateUser = asyncHandler( async (req, res) => {
  
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("labs", "name location");

   if (!user){
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: user
    });

});

//  Eliminar usuario
export const deleteUser = asyncHandler( async (req, res) => {

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user){
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: user
    });
  
});

export const loginUser = asyncHandler( async (req, res) => {
  
  const { email, password } = req.body;

    //  Buscar usuario
    const user = await User.findOne({ email });
    if (!user){
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }
    
    //  Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

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

});