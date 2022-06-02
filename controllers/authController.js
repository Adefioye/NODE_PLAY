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

const cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  httpOnly: true,
};

if (process.env.NODE_ENV.trim() === "production") cookieOptions.secure = true;

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(200).json({
    status: "Success",
    token,
    data: {
      user,
    },
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

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // 1) Check for email and password
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // 2) Check if user and password exist
  console.log(email);
  const user = await User.findOne({ email }).select("+password");

  console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError("User does not exist or password is incorrect", 401)
    );
  }

  // 3) Send the response with token
  createAndSendToken(user, 200, res);
});

exports.auth = catchAsync(async (req, res, next) => {
  // 1) Get the token and Check if it is there
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

  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Confirm the user with the token exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError("User with the token no longer exist", 401));
  }

  // 4) Confirm if user has not changed password after token has being issued
  const isPasswordChangedAfter = currentUser.changePasswordAfter(decoded.iat);

  if (isPasswordChangedAfter) {
    return next(
      new AppError(
        "User has recently changed password. Please log in again",
        401
      )
    );
  }

  // 5) Grant access to protected routes
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

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from the collection

  const user = await User.findById(req.user._id).select("+password");

  // 2) Check that POSTed password is correct
  const isPasswordCorrect = await user.correctPassword(
    req.body.oldPassword,
    user.password
  );

  if (!isPasswordCorrect)
    return next(
      new AppError(
        "Old password not correct. Please provide a correct one!",
        401
      )
    );

  // 3) Update the password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // 4) Log in the user and send JWT
  createAndSendToken(user, 200, res);
});
