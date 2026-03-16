import { body } from "express-validator";
import mongoose from "mongoose";

export const updateComputerValidator = [
  body("lab")
    .optional()
    .isArray()
    .withMessage("Labs must be an array")
    .custom((labs) =>
      labs.every((lab) => mongoose.Types.ObjectId.isValid(lab))
      )
    .withMessage("Each lab must be a valid ObjectId"),

  body("processor")
    .optional()
    .isString()
    .withMessage("Processor is required"),

  body("ram")
    .optional()
    .isString()
    .withMessage("RAM is required")
    .matches(/^\d+GB$/)
    .withMessage("RAM must be in format like 8GB, 16GB"),

  body("storage")
    .optional()
    .isString()
    .withMessage("Storage is required")
    .matches(/^\d+GB$/)
    .withMessage("Storage must be in format like 256GB, 512GB"),

  body("graphics")
    .optional()
    .isString()
    .withMessage("Graphics must be a string")
];