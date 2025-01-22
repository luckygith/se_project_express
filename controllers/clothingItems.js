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
  // console.log(req.user._id);
  const userId = req.user._id;
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((clothingItem) => {
      res.status(201).send(clothingItem);
    })
    .catch((error) => {
      res
        .status(SERVER_ERROR_500)
        .send({ message: "Failed to create clothing item", error });
    });
};

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => {
      res.status(200).send(clothingItems);
    })
    .catch((error) => {
      res
        .status(400)
        .send({ message: "Failed to retrieve clothing items", error });
    });
};

// const deleteClothingItem = (req, res) => {

// }
module.exports = { getClothingItems, createClothingItem };
