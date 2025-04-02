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

const BadRequestError = require("../errors/bad-request-error");
const ConflictError = require("../errors/unauthorized-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const NotFoundError = require("../errors/not-found-error");

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Missing Info: Email or Password"));
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
        next(new ConflictError("Authentication Error: user"));
      } else if (error.message === "Incorrect password") {
        next(new UnauthorizedError("Authentication Error: password"));
      } else {
        next(error);
      }
    });
};

const getCurrentUser = (req, res) => {
  // const { userId } = req.user._id;
  const userId = req.user._id;
  User.findById(userId)

    .then((user) => {
      if (!user) {
        next(new NotFoundError("User not found"));
      }
      return res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("UserId is invalid"));
      } else {
        next(error);
      }
    });
};

const createUser = (req, res) => {
  const { email, password, name, avatar } = req.body;

  if (!email || !password || !name || !avatar) {
    next(new BadRequestError("Missing required fields"));
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
        next(new ConflictError("Error: User already exists"));
      } else if (error.name === "ValidationError") {
        next(new BadRequestError("Error: name validation"));
      } else {
        next(error);
      }
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
        next(new NotFoundError("User not found"));
      }
      return res.send({ user });
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(new BadRequestError("Error: Invalid data"));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
};
