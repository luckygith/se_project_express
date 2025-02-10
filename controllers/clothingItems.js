const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_400,
  NOT_FOUND_404,
  SERVER_ERROR_500,
  UNAUTHORIZED_403,
  DUPLICATE_ERROR_409 = 409,
  INCORRECT_INFO_401 = 401,
} = require("../utils/statusCodes");

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => res.send(clothingItem))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_400)
          .send({ message: "Error: Failed to create clothing item" });
      }
      return res
        .status(SERVER_ERROR_500)
        .send({ message: "Error: Failed to create clothing item" });
    });
};

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() =>
      res
        .status(SERVER_ERROR_500)
        .send({ message: "Error: Failed to retrieve clothing items" })
    );
};

const deleteClothingItem = (req, res) => {
  const itemId = req.params.itemId;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_404).send({ message: "Item not found" });
      }
      if (item.owner.toString() !== userId) {
        return res
          .status(UNAUTHORIZED_403)
          .send({ message: "Unauthorized request" });
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })

    // ClothingItem.findByIdAndDelete(itemId)

    //   .then((item) => {
    //     if (!item) {
    //       return res.status(NOT_FOUND_404).send({ message: "Item not found" });
    //     }
    //     if (item.owner.toString() !== userId) {
    //       return res
    //         .status(UNAUTHORIZED_403)
    //         .send({ message: "Unauthorized request" });
    //     }

    //     return res.status(200).send({ message: "Item successfully deleted" });
    //   })
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
  const itemId = req.params.itemId;
  const userId = req.user._id;

  if (!userId) {
    return res.status(NOT_FOUND_404).send({ message: "User ID is required" });
  }

  if (!itemId) {
    return res.status(BAD_REQUEST_400).send({ message: "Item ID is required" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true, runValidators: true }
  )

    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "DocumentNotFoundError"; // Properly name the error for the catch block
      throw err;
    })
    .then((updatedItem) => {
      if (!itemId) {
        return res.status(NOT_FOUND_404).send({ message: "ItemID NONE" });
      }

      return res.status(200).send(updatedItem);
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
        .send({ message: "Failed like functionnn" });
    });
};

const unlikeItem = (req, res) => {
  // const itemId = req.params.itemId;
  const userId = req.user._id;
  const { itemId } = req.params;

  if (!userId) {
    return res.status(NOT_FOUND_404).send({ message: "User ID is required" });
  }

  if (!itemId) {
    return res.status(BAD_REQUEST_400).send({ message: "Item ID is required" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // remove _id from the array
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "DocumentNotFoundError"; // Properly name the error for the catch block
      throw err;
    })
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
      if (error.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_404).send({ message: "Item not found" });
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
  unlikeItem,
};
