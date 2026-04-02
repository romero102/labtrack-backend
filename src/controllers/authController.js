import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create firts user

export const setupAdmin = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();

  // 🔒 Solo permitir si NO hay usuarios
  if (users > 0) {
    return res.status(403).json({
      success: false,
      message: "System already initialized"
    });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin"
  });

  const adminObj = admin.toObject();
  delete adminObj.password;

  res.status(201).json({
    success: true,
    data: adminObj,
    message: "Admin created successfully"
  });
});

//  login user

export const loginUser = asyncHandler( async (req, res) => {
  
  const { email, password } = req.body;

    //  search user
    const user = await User.findOne({ email });
    if (!user){
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error("Usuario desactivado");
      error.statusCode = 403;
      throw error;
    }
    
    //  Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

    //  Generate token
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

//  forgot password

export const forgotPassword = asyncHandler(async (req, res) => {

  const { email } = req.body;

  if (!email) {
    const error = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token before saving
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: user.email,
    subject: "Password Reset",
    text: `Reset your password here: ${resetUrl}`
  });

  res.status(200).json({
    success: true,
    message: "Password reset email sent"
  });

});

export const resetPassword = asyncHandler(async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required"
    });
  }

  // Hashear el token recibido
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  // Buscar usuario con token válido y no expirado
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token"
    });
  }

  // Encriptar nueva contraseña
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Limpiar campos de recuperación
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully"
  });

});

//  Status

export const getSetupStatus = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();

  res.status(200).json({
    success: true,
    initialized: users > 0
  });
});