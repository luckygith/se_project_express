const router = require("express").Router();
const auth = require("../middlewares/auth");

// GET /items — returns all clothing items
// POST /items — creates a new item
// DELETE /items/:itemId — deletes an item by _id

// PUT /items/:itemId/likes — like an item
// DELETE /items/:itemId/likes — unlike an item

const {
  createClothingItem,
  getClothingItems,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

// routes start with /items

router.post("/", auth, createClothingItem);
router.get("/", getClothingItems);
router.delete("/:itemId", auth, deleteClothingItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
