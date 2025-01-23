const clothingItem = require("../models/clothingItem");
const ClothingItem = require("../models/clothingItem");
const { search } = require("../routes");
const router = require("express").Router();
const {
  BAD_REQUEST_400,
  NOT_FOUND_404,
  SERVER_ERROR_500,
} = require("../utils/errors");

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => {
      res.status(200).send(clothingItem);
    })
    .catch((error) => {
      if (!name || name.length < 2 || !name.length < 30) {
        return res.status(400).send({
          message: "name field is req / must be atleast 2 characters long",
        });
      }
      res
        .status(SERVER_ERROR_500)
        .send({ message: "Failed to create clothing item", error });
    });
};

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => {
      return res.status(200).send(clothingItems);
    })
    .catch((error) => {
      res
        .status(BAD_REQUEST_400)
        .send({ message: "Failed to retrieve clothing items", error });
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

      res.status(200).send({ message: "Item successfully deleted" });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return res.status(400).send({ message: "Invalid ID format" });
      }

      const ownerId = item.owner.toString();
      if (ownerId !== req.user._id || "cast error") {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Failed to delete item. Authorization error" });
      }

      return res
        .status(BAD_REQUEST_400)
        .send({ message: "Failed to delete item", error });
    });
};

const likeClothingItem = (req, res) => {
  const itemId = req.params;

  ClothingItem.findByIdAndUpdate(itemId)
    .then((itemId) => {
      if (!itemId) {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Failed to like item", error });
      }
      return res.status(200).send(itemId);
    })
    .catch((error) => {
      res
        .status(BAD_REQUEST_400)
        .send({ message: "Failed like function", error });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeClothingItem,
};
