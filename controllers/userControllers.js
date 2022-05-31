const AppError = require("../utils/appError");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const sendEmail = require("./../utils/email");

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
  // Find the user with the email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("No user with this email address", 404));
  }

  // Generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Send the token to user's email
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

exports.resetPassword = catchAsync(async (req, res, next) => {});
