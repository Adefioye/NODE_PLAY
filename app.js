const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const AppError = require("./utils/appError");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// GLOBAL MIDDLEWARE
const limiter = rateLimit({
  max: 100,
  windowMs: 1 * 60 * 60 * 1000,
  message: "Too many requests made to this API. Please try again in an hour",
});

app.use("/api", limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

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

app.use(globalErrorHandler);

module.exports = app;

// {
//   "singleQuote": false
// }
