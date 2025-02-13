const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // library for hashing
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_400,
  NOT_FOUND_404,
  SERVER_ERROR_500,
  DUPLICATE_ERROR_409,
  INCORRECT_INFO_401,
} = require("../utils/statusCodes");

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_400)
      .send({ message: "Missing Info: Email or Password" });
  }
  return User.findUserByCredentials(email, password) // calling model method to verify creds
    .then((user) => {
      console.log(user);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token }); // Return 200 and the token
    })
    .catch((error) => {
      if (error.message === "User not found") {
        return res
          .status(INCORRECT_INFO_401)
          .send({ message: "Authentication Error: user" });
      }
      if (error.message === "Incorrect password") {
        return res
          .status(INCORRECT_INFO_401)
          .send({ message: "Authentication Error: password" });
      }
      // // authentication error
      return res.status(SERVER_ERROR_500).send({ message: error.message });
    });
};

const getCurrentUser = (req, res) => {
  // const { userId } = req.user._id;
  const userId = req.user._id;
  User.findById(userId)

    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_404).send({ message: "User not found" });
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "UserId is invalid" });
      }
      return res
        .status(SERVER_ERROR_500)
        .send({ message: "Servor Error: User info request unsuccessful" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res
      .status(BAD_REQUEST_400)
      .send({ message: "Missing required fields" });
  }

  return User.findOne({ email }) // Check if user already exists
    .then((userId) => {
      if (userId) {
        throw new Error("User already exists");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash, // adding the hash to the db
      })
    )

    .then((user) =>
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      })
    ) // EXCLUDE SENDING PASSWORD DETAILS!
    .catch((error) => {
      console.error("Error creating user:", error);

      if (
        error.code === 11000 ||
        error.message.includes("User already exists")
      ) {
        return res
          .status(DUPLICATE_ERROR_409)
          .send({ message: "Error: User already exists" });
      }
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Error: name validation" });
      }
      return res.status(SERVER_ERROR_500).send({
        message: "Server Error: Create User was unsuccessful",
        error,
      });
    });
};

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;

  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_404).send({ message: "User not found!!!" });
      }
      return res.send({ user });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Error: Invalid data" });
      }
      return res
        .status(SERVER_ERROR_500)
        .send({ message: "Servor Error: request unsuccessful" });
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
};
