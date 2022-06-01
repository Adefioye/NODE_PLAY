const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const sendEmail = require("./../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  res.status(200).json({
    status: "Success",
    result: users.length,
    data: {
      users,
    },
  });
});

const filterObj = (Obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(Obj).forEach((item) => {
    if (allowedFields.includes(item)) newObj[item] = Obj[item];
  });

  return newObj;
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "This route is not yet defined",
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "This route is not yet defined",
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // Dont allow password and confirmPassword update
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "Password not allowed to be updated via this route. Please use /updatePassword route",
        400
      )
    );
  }

  // This update route only works for changing name and email
  const filteredBody = filterObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success",
    data: {
      user: updatedUser,
    },
  });
});

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "This route is not yet defined",
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "Error",
    message: "This route is not yet defined",
  });
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Find the user with the email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("No user with this email address", 404));
  }

  // 2) Generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send the token to user's email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Please send a PATCH request to: ${resetURL}.\n\nIf you
  didn't forget your password. Ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token (Expires in 10mins)",
      message,
    });

    res.status(201).json({
      status: "Success",
      message: "Password reset token is in your email",
    });
  } catch (error) {
    (user.passwordResetToken = undefined),
      (user.passwordResetExpires = undefined);

    return next(
      new AppError(
        "Error sending password reset token to email. Try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const { token } = req.params;
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // 2) If token has not expired and user exists, set new password
  if (!user) {
    return next(
      new AppError(
        "Reset token does not exist or it has expired. Forgot password again!",
        400
      )
    );
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) Update passwordChangedAt for the user (! Done by a pre-save hook in the userSchema)
  // 4) Log the user in and send JWT
  const jwtToken = signToken(user._id);

  res.status(201).json({
    status: "Success",
    token: jwtToken,
  });
});
