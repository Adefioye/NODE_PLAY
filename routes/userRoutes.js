const express = require("express");

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
  updateMe,
  deleteMe,
} = require("./../controllers/userControllers");
const {
  signUp,
  login,
  auth,
  updatePassword,
} = require("./../controllers/authController");

const router = express.Router();

router.route("/signUp").post(signUp);

router.route("/login").post(login);

router.route("/forgotPassword").patch(forgotPassword);

router.route("/resetPassword/:token").patch(resetPassword);

router.route("/updatePassword").patch(auth, updatePassword);

router.route("/updateMe").patch(auth, updateMe);

router.route("/deleteMe").delete(auth, deleteMe);

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
