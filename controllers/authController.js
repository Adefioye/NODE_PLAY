const jwt = require("jsonwebtoken");

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "Success",
    data: {
      token,
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // Check for email and password
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // Check if user and password exist
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError("User does not exist or password is incorrect", 401)
    );
  }

  // Send the response with token
  const token = signToken(user._id);
  res.status(201).json({
    status: "Success",
    token,
  });
});
