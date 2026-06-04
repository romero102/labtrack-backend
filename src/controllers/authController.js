import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { asyncHandler } from "../utils/asyncHandler.js";
import dotenv from "dotenv";
import { error } from "console";
import { sendPasswordResetEmail } from "../services/emailService.js";

// Create firts user

export const setupAdmin = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();

  // Solo permitir si NO hay usuarios
  if (users > 0) {
    return res.status(403).json({
      success: false,
      message: "System already initialized",
    });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
  });

  const adminObj = admin.toObject();
  delete adminObj.password;

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(201).json({
    success: true,
    data: {
      id: admin._id,
      name: admin.name,
      role: admin.role,
    },
    message: "Admin created successfully",
  });
});

//  login user

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //  search user
  const user = await User.findOne({ email }).populate("labs", "name location");
  if (!user) {
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
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
  //  save token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.json({
    id: user._id,
    name: user.name,
    role: user.role,
    labs: user.labs,
  });
});

// logout

export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ message: "Logout exitoso" });
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
    const error = new Error("If the email exists, a recovery email was sent");
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

  await sendPasswordResetEmail(user.email, resetUrl);

  res.status(200).json({
    success: true,
    message: "Password reset email sent",
  });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  // Hashear el token recibido
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Buscar usuario con token válido y no expirado
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
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
    message: "Password reset successfully",
  });
});

//  Status

export const getSetupStatus = asyncHandler(async (req, res) => {
  const users = await User.countDocuments();

  res.status(200).json({
    success: true,
    initialized: users > 0,
  });
});

export const verifyToken = asyncHandler(async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const userFound = await User.findById(decoded.id).select("name email role");

  if (!userFound) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }

  res.json({
    id: userFound._id,
    name: userFound.name,
    email: userFound.email,
    role: userFound.role,
  });
});
