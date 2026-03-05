export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error:", err);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Error específico de MongoDB - ID inválido
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // Error de clave duplicada (unique)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value";
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};