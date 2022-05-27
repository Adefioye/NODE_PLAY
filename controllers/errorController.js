const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const duplicateValue = err.keyValue.name;
  const message = `Duplicate field value: ${duplicateValue}. Please enter another name`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errMessages = Object.values(err.errors)
    .map((item) => item.message)
    .join(". ");
  const message = `Invalid input data: ${errMessages}`;
  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendProdError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error:", err);

    res.status(500).json({
      status: "Error",
      message: "Something went really wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";

  if (process.env.NODE_ENV.trim() === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV.trim() === "production") {
    let error = { ...err };

    if (err.name === "CastError") {
      error = handleCastErrorDB(error);
    } else if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } else if (err.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }

    sendProdError(error, res);
  }
};
