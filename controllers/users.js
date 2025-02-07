// const router = require("express").Router();
const User = require("../models/user");

const bcrypt = require("bcryptjs"); //library for hashing
const jwt = require("jsonwebtoken");

const {
  BAD_REQUEST_400,
  NOT_FOUND_404,
  SERVER_ERROR_500,
  DUPLICATE_ERROR_409,
  INCORRECT_INFO_401,
} = require("../utils/statusCodes");

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password) //calling model method to verify creds
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
      // authentication successful! user is in the user variable
    })
    .catch((error) => {
      // authentication error
      res.status(INCORRECT_INFO_401).send({ message: error.message });
    });
};

const getUsers = (req, res) => {
  User.find({}) // .find() asynchronous /empty {} returns all!
    .then((users) => res.send(users))
    .catch(() =>
      res.status(SERVER_ERROR_500).send({ message: "Server Error" })
    );
};

const getCurrentUser = (req, res) => {
  const { userId } = req.user;
  User.findById(userId)

    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_404).send({ message: "User not found" });
      }
      return res.send({ user });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "UserId is invalid" });
      }
      return res
        .status(SERVER_ERROR_500)
        .send({ message: "Error: User info request unsuccessful" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        avatar,
        email,
        password: hash, // adding the hash to the database
      });
    })
    .then((user) =>
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      })
    ) //EXCLUDE SENDING PASSWORD DETAILS!
    .catch((error) => {
      if (!match) {
        res
          .status(INCORRECT_INFO_401)
          .send({ message: "Error: inccorect email or password" });
      }
      if (error.code === 11000) {
        res
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
        .send({ message: "Error: Create User was unsuccessful" });
    });
};

const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  const { userId } = req.user;
  User.findByIdAndUpdate(userId, { name, avatar })
    .then((user) => {
      if (!name && !avatar) {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Name or avatar must be provided to update" });
      }
      if (!user) {
        return res.status(NOT_FOUND_404).send({ message: "User not found" });
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
        .send({ message: "Error: request unsuccessful" });
    });
};

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
};
