const fs = require('fs');
const path = require('path');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log('Hello middleware');
  next();
});

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'NodePlay' });
// });

// app.post('/', (req, res) => {
//   res.status(201).send('You can post to this endpoint...');
// });

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'))
);

// ROUTE HANDLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;

  const tour = tours.find((tour) => tour.id === Number(id));

  if (!tour) {
    return res.status(404).json({
      status: 'Fail',
      message: `No tour with ID: ${id}`,
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  try {
    const newId = Number(tours[tours.length - 1].id) + 1;
    const newTour = Object.assign({ id: newId }, req.body);

    tours.push(newTour);

    fs.writeFile(
      path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'),
      JSON.stringify(tours),
      (err) => {
        if (err) throw err;
        res.status(201).json({
          status: 'Success',
          data: {
            newTour,
          },
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const updateTour = (req, res) => {
  const { id } = req.params;

  if (Number(id) > tours.length - 1) {
    return res.status(404).json({
      status: 'Fail',
      message: `No tour with ID: ${id}`,
    });
  }

  const updatedTours = tours.map((tour) => {
    if (tour.id === Number(id)) {
      return { ...tour, duration: 100 };
    } else {
      return tour;
    }
  });

  fs.writeFile(
    path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'),
    JSON.stringify(updatedTours),
    (err) => {
      if (err) throw err;
      res.status(201).json({
        status: 'Success',
        data: 'Data successfully updated!',
      });
    }
  );
};

const deleteTour = (req, res) => {
  const { id } = req.params;

  if (Number(id) > tours.length - 1) {
    return res.status(404).json({
      status: 'Fail',
      message: `No tour with the ID: ${id}`,
    });
  }

  res.status(204).json({
    status: 'Success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not yet defined',
  });
};

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

PORT = 5000;

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
