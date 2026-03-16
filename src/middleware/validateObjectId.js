import mongoose from "mongoose";

export const validateObjectId = (req, res, next) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid ID format");
    error.statusCode = 400;
    return next(error);
  }

  next();
};