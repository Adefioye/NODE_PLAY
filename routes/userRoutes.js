const express = require("express");

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} = require("./../controllers/userControllers");
const { signUp, login, auth } = require("./../controllers/authController");

const router = express.Router();

router.route("/signUp").post(signUp);

router.route("/login").post(login);

router.route("/forgotPassword").post(forgotPassword);

router.route("/resetPassword/:token").patch(resetPassword);

router
  .route("/")
  .get(getAllUsers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
