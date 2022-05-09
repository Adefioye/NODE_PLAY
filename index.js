const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});

app.delete('/api/v1/tours/:id', (req, res) => {
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
});

PORT = 5000;

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
