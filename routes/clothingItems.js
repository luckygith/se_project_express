const router = require("express").Router();

// GET /items — returns all clothing items
// POST /items — creates a new item
// DELETE /items/:itemId — deletes an item by _id

const {
  createClothingItem,
  getClothingItems,
} = require("../controllers/clothingItems");

router.post("/", createClothingItem);
router.get("/", getClothingItems);
// router.delete();

module.exports = router;
