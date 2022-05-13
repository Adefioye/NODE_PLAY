const fs = require("fs");
const path = require("path");

const Tour = require("./../models/tourModel");

// const tours = JSON.parse(
//   fs.readFileSync(
//     path.join(__dirname, '..', 'dev-data', 'data', 'tours-simple.json')
//   )
// );

exports.getAllTours = (req, res) => {
  // res.status(200).json({
  //   status: 'Success',
  //   results: tours.length,
  //   data: {
  //     tours,
  //   },
  // });
};

exports.getTour = (req, res) => {
  // const { id } = req.params;
  // const tour = tours.find((tour) => tour.id === Number(id));
  // res.status(200).json({
  //   status: 'Success',
  //   data: {
  //     tour,
  //   },
  // });
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

exports.updateTour = (req, res) => {
  // const { id } = req.params;
  // const updatedTours = tours.map((tour) => {
  //   if (tour.id === Number(id)) {
  //     return { ...tour, duration: 100 };
  //   } else {
  //     return tour;
  //   }
  // });
  // fs.writeFile(
  //   path.join(__dirname, '..', 'dev-data', 'data', 'tours-simple.json'),
  //   JSON.stringify(updatedTours),
  //   (err) => {
  //     if (err) throw err;
  //     res.status(201).json({
  //       status: 'Success',
  //       data: 'Data successfully updated!',
  //     });
  //   }
  // );
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: "Success",
    data: null,
  });
};
