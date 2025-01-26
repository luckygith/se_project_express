// const router = require("express").Router();
const User = require("../models/user");
const {
  BAD_REQUEST_400,
  NOT_FOUND_404,
  SERVER_ERROR_500,
} = require("../utils/statusCodes");

const getUsers = (req, res) => {
  User.find({}) // .find() asynchronous /empty {} returns all!
    .then((users) => res.send(users))
    .catch(() =>
      res.status(SERVER_ERROR_500).send({ message: "Server Error" })
    );
};

const getUserId = (req, res) => {
  const { userId } = req.params;
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
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send(user))
    .catch((error) => {
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

module.exports = { getUsers, getUserId, createUser };
