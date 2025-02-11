const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getCurrentUser,
  updateUserProfile,
  createUser,
} = require("../controllers/users");

router.get("/me", auth, getCurrentUser); // Fetching user info deets
router.patch("/me", auth, updateUserProfile);

router.post("/", createUser);
module.exports = router;
