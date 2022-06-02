const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// Set security HTTP headers
app.use(helmet());

// Logging middleware for development environment
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// GLOBAL MIDDLEWARE
const limiter = rateLimit({
  max: 100,
  windowMs: 1 * 60 * 60 * 1000,
  message: "Too many requests made to this API. Please try again in an hour",
});

// Limit number of request sent to the API endpoints
app.use("/api", limiter);

// Body parser middleware: Pass body to req.body
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));

// Data sanitization for preventing NOSQL injections query
app.use(mongoSanitize());
// Data sanitization for preventing XSS attack
app.use(xss());

// Middleware for serving static assets like CSS, HTML and image assets
app.use(express.static(`${__dirname}/public`));

// Middlware for handling requests to users and tours endpoints
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: "Fail",
  //   message: `Can't find ${req.originalUrl} from this server!`,
  // });
  const err = new AppError(
    `Can't find ${req.originalUrl} from this server!`,
    404
  );

  next(err);
});

// Global error handler middleware
app.use(globalErrorHandler);

module.exports = app;

// {
//   "singleQuote": false
// }
