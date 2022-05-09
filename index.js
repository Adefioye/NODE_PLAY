const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'NodePlay' });
// });

// app.post('/', (req, res) => {
//   res.status(201).send('You can post to this endpoint...');
// });

console.log(__dirname);

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

PORT = 5000;

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
