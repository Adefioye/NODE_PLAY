const fs = require("fs");
const path = require("path");

const Tour = require("./../models/tourModel");

// const tours = JSON.parse(
//   fs.readFileSync(
//     path.join(__dirname, '..', 'dev-data', 'data', 'tours-simple.json')
//   )
// );

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();

    res.status(200).json({
      status: "Success",
      data: {
        tours,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await Tour.findById(id);

    res.status(200).json({
      status: "Success",
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "Success",
      data: {
        newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "Success",
      data: {
        updatedTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  const { id } = req.params;

  try {
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      message: error,
    });
  }
};
