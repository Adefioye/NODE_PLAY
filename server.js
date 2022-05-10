const app = require('./app');

PORT = 5000;

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
