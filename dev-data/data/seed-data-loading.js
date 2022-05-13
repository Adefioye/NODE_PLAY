const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Tour = require("./../../models/tourModel");
const dotenv = require("dotenv");

dotenv.config({ path: "./../../config.env" });

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

const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, "tours-simple.json"), "utf-8")
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data successfully loaded!");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data successfully deleted!");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// console.log(process.argv);

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
