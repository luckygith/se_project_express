const router = require("express").Router();

// GET /items — returns all clothing items
// POST /items — creates a new item
// DELETE /items/:itemId — deletes an item by _id

// PUT /items/:itemId/likes — like an item
// DELETE /items/:itemId/likes — unlike an item

const {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
  likeClothingItem,
} = require("../controllers/clothingItems");

// routes start with /items

router.post("/", createClothingItem);
router.get("/", getClothingItems);
router.delete("/:itemId", deleteClothingItem);
router.put("/:itemId/likes", likeClothingItem);

module.exports = router;
