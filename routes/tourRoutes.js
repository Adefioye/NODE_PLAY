const express = require("express");

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkBody,
  aliasTopTours,
  getAllStats,
  getMonthlyPlan,
} = require("./../controllers/tourControllers");

const { auth, restrictTo } = require("./../controllers/authController");

const router = express.Router();

// router.param('id', checkID);

router.route("/tours-stat").get(getAllStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router.route("/top-5-cheap-tours").get(aliasTopTours, getAllTours);

router
  .route("/")
  .get(auth, getAllTours)
  .post(createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(auth, restrictTo("admin", "lead-guide"), deleteTour);

module.exports = router;
