const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const ForbiddenError = require("../errors/forbidden-error")
const ClothingItem = require("../models/clothingItem");


const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((clothingItem) => res.send(clothingItem))
    .catch((error) => {
      if (error.name === "ValidationError") {
        next(
          new BadRequestError("Could not update with information provided.")
        );
      } else {
        next(error);
      }
    });
};

// .catch((error) => {
// if (error.name === "CastError") {
// next(new BadRequestError("Invalid data provided"));
// }

const getClothingItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((error) => {
      next(error);
    });
};

const deleteClothingItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        next(new NotFoundError("Item not found"));
      }
      if (item.owner.toString() !== userId) {
        return next(new UnauthorizedError("Unauthorized request: user"));
      }

      return ClothingItem.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item successfully deleted" })
      );
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        next(new BadRequestError("Failed to delete item"));
      } else {
        next(error);
      }
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  if (!itemId) {
    next(new BadRequestError("Item ID is required"));
  }
  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } }, // add _id to the array if it's not there yet
    { new: true, runValidators: true }
  )

    .orFail(() => {
      const err = new Error("Item not found");
      err.name = "DocumentNotFoundError"; // Properly name the error for the catch block
      throw err;
    })
    .then((updatedItem) => res.status(200).send(updatedItem))
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Item ID is required"));
      } else if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(error);
      }
    });
};

const unlikeItem = (req, res, next) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  if (!itemId) {
    next(new BadRequestError("Item ID is required"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } }, // removess _id from the array
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("Item not found");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then(() =>
      // Send the response only if the item is successfully updated
      res.status(200).send({ message: "Item is updated" })
    )
    .catch((error) => {
      if (error.name === "CastError") {
        next(new BadRequestError("Failed to dislike item. Item Id Error"));
      } else if (error.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found"));
      } else {
        next(error);
      }
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
};
