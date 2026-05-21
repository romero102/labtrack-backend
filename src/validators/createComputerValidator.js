import { body } from "express-validator";
import mongoose from "mongoose";

export const createComputerValidator = [
  body("lab")
    .notEmpty()
    .withMessage("Laboratory is required"),

  body("processor")
    .notEmpty()
    .withMessage("Processor is required"),

  body("ram")
    .notEmpty()
    .withMessage("RAM is required")
    .matches(/^\d+GB$/)
    .withMessage("RAM must be in format like 8GB, 16GB"),

  body("storage")
    .notEmpty()
    .withMessage("Storage is required")
    .matches(/^\d+\s?(GB|TB)\s(HDD|SSD)$/i)
    .withMessage("Storage must be in format like 256GB SSD, 512GB HDD"),

  body("graphics")
    .optional()
    .isString()
    .withMessage("Graphics must be a string")
];