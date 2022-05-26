const fs = require("fs");
const path = require("path");

const Tour = require("./../models/tourModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// const tours = JSON.parse(
//   fs.readFileSync(
//     path.join(__dirname, '..', 'dev-data', 'data', 'tours-simple.json')
//   )
// );

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // Send response
  res.status(200).json({
    status: "Success",
    result: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const tour = await Tour.findById(id);

  if (!tour) {
    const err = new AppError("No document with that ID!", 404);
    return next(err);
  }

  res.status(200).json({
    status: "Success",
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: "Success",
    data: {
      newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedTour) {
    const err = new AppError("No document with that ID!", 404);
    return next(err);
  }

  res.status(200).json({
    status: "Success",
    data: {
      updatedTour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deletedTour = await Tour.findByIdAndDelete(id);

  if (!deletedTour) {
    const err = new AppError("No document with that ID!", 404);
    return next(err);
  }

  res.status(204).json({
    status: "Success",
    data: null,
  });
});

exports.getAllStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numOfTours: { $sum: 1 },
        numOfRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: "EASY" } },
    // },
  ]);

  res.status(200).json({
    status: "Success",
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);
  const plan = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);

  res.status(200).json({
    status: "Success",
    data: {
      plan,
    },
  });
});
