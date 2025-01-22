const User = require("../models/user");
const router = require("express").Router();
const {
  BAD_REQUEST_400,
  NOT_FOUND_404,
  SERVER_ERROR_500,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({}) // .find() asynchronous /empty {} returns all!
    .then((users) => {
      res.send(users);
    })
    .catch(console.error);
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  console.log("getUserId is working");
  User.findById(userId)

    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    })

    .catch((error) => {
      res.status(BAD_REQUEST_400).send(error);
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log(name, avatar);
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => res.status(BAD_REQUEST_400).send(error));
};

module.exports = { getUsers, getUserId, createUser };
