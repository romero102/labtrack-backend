import { body } from "express-validator";

export const createLabValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 2 })
    .withMessage("Location must be at least 2 characters long"),

  body("computerCount")
    .trim()
    .notEmpty()
    .withMessage("The number of computers is required")
    .isInt({ min: 1 })
    .withMessage("The number of computers must be a positive integer")
    .toInt(),

];