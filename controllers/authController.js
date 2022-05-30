const jwt = require("jsonwebtoken");
const { promisify } = require("util");

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
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
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

exports.auth = catchAsync(async (req, res, next) => {
  // Get the token and Check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in again", 401)
    );
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Confirm the user with the token exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User with the token no longer exist", 401));
  }

  // Confirm if user has not changed password after token has being issued
  const isPasswordChangedAfter = currentUser.changePasswordAfter(decoded.iat);

  if (isPasswordChangedAfter) {
    return next(
      new AppError(
        "User has recently changed password. Please log in again",
        401
      )
    );
  }

  // Grant access to protected routes
  req.user = currentUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have the permission to perform delete operation",
          403
        )
      );
    }

    next();
  };
};
