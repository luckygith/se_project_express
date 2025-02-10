// const router = require("express").Router();
const User = require("../models/user");

const bcrypt = require("bcryptjs"); //library for hashing
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_400,
  NOT_FOUND_404,
  SERVER_ERROR_500,
  DUPLICATE_ERROR_409,
  INCORRECT_INFO_401,
  UNAUTHORIZED_403,
} = require("../utils/statusCodes");

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_400)
      .send({ message: "Missing Info: Email or Password" });
  }
  return User.findUserByCredentials(email, password) //calling model method to verify creds
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
          .send({ message: "Authentication Error" });
      }
      // // authentication error
      return res.status(SERVER_ERROR_500).send({ message: error.message });
    });
};

const getUsers = (req, res) => {
  User.find({}) // .find() asynchronous /empty {} returns all!
    .then((users) => {
      return res.status(200).send(users);
    })
    .catch(() =>
      res.status(SERVER_ERROR_500).send({ message: "Server Error" })
    );
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

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res
          .status(DUPLICATE_ERROR_409)
          .send({ message: "User already exists" });
      }
      // Continue with user creation if no existing user
      return bcrypt.hash(password, 10); //RETURN ONLY THIS PROMISE TO PREVENT multiple EXECS
    })
    .then((hash) => {
      return User.create({
        name,
        avatar,
        email,
        password: hash, // adding the hash to the database
      });
    })
    .then((user) => {
      if (!user) return;
      return res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    }) //EXCLUDE SENDING PASSWORD DETAILS!
    .catch((error) => {
      if (error.code === 11000) {
        return res
          .status(DUPLICATE_ERROR_409)
          .send({ message: "Error: User already exists" });
      }
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Unable to complete request" });
      }
      return res
        .status(SERVER_ERROR_500)
        .send({ message: "Server Error: Create User was unsuccessful", error });
    });
};

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  // const { userId } = req.user;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!name && !avatar) {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Name or avatar must be provided to update" });
      }
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
  getUsers,
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
};
