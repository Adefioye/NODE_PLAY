const express = require("express");

const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} = require("./../controllers/userControllers");
const { signUp, login } = require("./../controllers/authController");

const router = express.Router();

router.route("/signUp").post(signUp);

router.route("/login").post(login);

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
