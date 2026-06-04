export const errorHandler = (err, req, res, next) => {
  
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

  if (statusCode >= 500) {
    console.error("🔥 Server Error:", err);
  } else {
    console.warn(`⚠️ ${statusCode} ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
