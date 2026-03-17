import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../utils/asyncHandler.js";

//  Create user
export const createUser = asyncHandler( async (req, res) => {
  
    const { name, email, password, role, labs } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email already exists");
      error.statusCode = 400;
      throw error;
    }

    //  Encrypt password
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

//  Get all users
export const getAllUsers = asyncHandler( async (req, res) => {
  
    const users = await User.find({ isActive: true }).populate("labs", "name location");
     res.status(200).json({
      success: true,
      data: users
    });
});

//  Get user by ID
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

//  Update user
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

//  delete user
export const deleteUser = asyncHandler( async (req, res) => {

  if (req.user.id === req.params.id) {
    const error = new Error("No puedes desactivarte a ti mismo");
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOneAndUpdate(
    { _id: req.params.id, isActive: true },
    { isActive: false },
    { new: true }
  );

  if (!user) {
    const error = new Error("User not found or is already inactive");
    error.statusCode = 404;
    throw error;
  }

    res.status(200).json({
      success: true,
      data: user
    });
  
});

//  Restore user

export const restoreUser = asyncHandler(async (req, res) => {
  
  const user = await User.findOneAndUpdate(
  { _id: req.params.id, isActive: false },
  { isActive: true },
  { new: true }
  );

  if (!user) {
    const error = new Error("User not found or already active");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    message: "User reactivated",
    data: user
  });
});