const clothingItem = require("../models/clothingItem");
const ClothingItem = require("../models/clothingItem");
const { search } = require("../routes");
const router = require("express").Router();
const {
  BAD_REQUEST_400,
  NOT_FOUND_404,
  SERVER_ERROR_500,
} = require("../utils/statusCodes");

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => {
      res.send(clothingItem);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        res
          .status(BAD_REQUEST_400)
          .send({ message: "Error: Failed to create clothing item" });
      }
      res
        .status(SERVER_ERROR_500)
        .send({ message: "Error: Failed to create clothing item" });
    });
};

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      return res.send(items);
    })
    .catch(() => {
      res
        .status(SERVER_ERROR_500)
        .send({ message: "Error: Failed to retrieve clothing items" });
    });
};

const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)

    .then((item) => {
      if (!item) {
        // throw new Error({ message: '1 => user not found' });
        return res.status(NOT_FOUND_404).send({ message: "Item not found" });
      }

      res.send({ message: "Item successfully deleted" });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Failed to delete item. Authorization error" });
      }

      return res
        .status(BAD_REQUEST_400)
        .send({ message: "Failed to delete item" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((itemId) => {
      return res.send(itemId);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Item ID is invalid" });
      }
      if (error.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_404).send({ message: "Item not found" });
      }
      // else {
      //   return res.status(NOT_FOUND_404).send({ message: "Item not found" });
      // }
      return res
        .status(SERVER_ERROR_500)
        .send({ message: "Failed like function" });
    });
};

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // remove _id from the array
    { new: true }
  )
    .then((itemId) => {
      if (!itemId) {
        return res.status(NOT_FOUND_404).send({ message: "Invalid ID format" });
      }
      return res.send({ message: "Item is disliked" });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Failed to dislike item. Item Id Error" });
      }
      return res
        .status(SERVER_ERROR_500)
        .send({ message: "Failed dislike function" });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
