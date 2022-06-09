const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  review: {
    type: String,
    required: [true, "Review cannot be empty"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Review must have a user"],
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "Tour",
    required: [true, "Review must belong to a tour"],
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
