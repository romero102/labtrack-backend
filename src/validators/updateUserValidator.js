import { body } from "express-validator";
import mongoose from "mongoose";

export const updateUserValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .optional()
    .trim()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
    })
    .withMessage("Password must contain uppercase, lowercase and number"),

  body("role")
    .optional()
    .isIn(["admin", "technician"])
    .withMessage("Role must be either admin or technician"),

  body("labs")
    .optional()
    .isArray()
    .withMessage("Labs must be an array")
    .custom((labs) =>
      labs.every((lab) => mongoose.Types.ObjectId.isValid(lab))
    )
    .withMessage("Each lab must be a valid ObjectId"),

];