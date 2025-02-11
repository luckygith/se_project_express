const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    required: true,
    type: String,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "Invalid URL",
    },
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Invalid Email",
    },
  },
  password: {
    required: true,
    type: String,
    minlength: 8,
    select: false, // ensures user's password password hidden when verifying creds
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  // trying to find the user by email
  return this.findOne({ email })
    .select("+password") // Explicitly include password for authentication// this — the User model
    .then((user) => {
      // not found - rejecting the promise
      if (!user) {
        return Promise.reject(new Error("User not found"));
      }

      // if found - comparing hashes
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrrrrect email or password"));
        }
        return user; // now user is available
      });
    })
    .catch((error) => {
      console.error("Authentication Error:", error.message); // Log the error for debugging
      return Promise.reject(error);
    });
};

module.exports = mongoose.model("user", userSchema);
