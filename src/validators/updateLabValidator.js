import { body } from "express-validator";

export const updateLabValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("location")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Location must be at least 2 characters long"),

  body("computerCount")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage("The number of computers must be a positive integer")
    .toInt(),
];