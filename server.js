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

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});

const Tour = mongoose.model("Tour", tourSchema);

// const newTour = new Tour({
//   name: "The Park Camper",
//   price: 970,
// });

// newTour
//   .save()
//   .then((data) => {
//     console.log("Data saved into database");
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log("Error connecting to database!");
//     console.log(err);
//   });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on PORT: ${PORT}`);
});
