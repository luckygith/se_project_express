const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, updateUserProfile } = require("../controllers/users");

router.get("/me", auth, getCurrentUser); // Fetching user info deets
router.patch("/me", auth, updateUserProfile);

module.exports = router;
