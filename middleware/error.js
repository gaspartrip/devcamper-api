const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  if (err.name === "CastError" || err.message === "CastError") {
    err = new ErrorResponse("Resource not found", 404);
  }
  if (err.code === 11000) {
    err = new ErrorResponse("Duplicate field value entered", 400);
  }
  if (err.name === "ValidationError") {
    err = new ErrorResponse(
      Object.values(err.errors).map((value) => value.properties.message),
      400
    );
  }
  res.status(err.statusCode || 500).json({
    success: false,
    err: err.message || "Server error",
  });
};

module.exports = errorHandler;
