const mongoose = require("mongoose");
const validator = require("validator");

const clothingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    required: true,
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    required: true,
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  owner: {
    // a link to the item author's model of the ObjectId type, a required field
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  likes: {
    // a list of users who liked the item, an ObjectId array with a reference to the user modal (empty by default)
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  createdAd: {
    // the item creation date, a field with the Date type and the default value Date.now
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingSchema);
