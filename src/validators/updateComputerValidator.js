import { body } from "express-validator";
import mongoose from "mongoose";

export const updateComputerValidator = [
  body("lab")
    .optional()
    .isString()
    .withMessage("Laboratory is required"),

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
    .matches(/^\d+\s?(GB|TB)\s(HDD|SSD)$/i)
    .withMessage("Storage must be in format like 256GB, 512GB"),

  body("graphics")
    .optional()
    .isString()
    .withMessage("Graphics must be a string"),
];