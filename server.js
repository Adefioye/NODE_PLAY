const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

const MONGO_URL = process.env.MONGO_URL.replace(
  "<PASSWORD>",
  process.env.MONGO_PASSWORD
);

// CONNECT TO DATABASE
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database is connected!");
  })
  .catch((err) => {
    console.log("Error connecting to database!");
    console.log(err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
