const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, updateUserProfile } = require("../controllers/users");

const { validateUserUpdate} = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser); // Fetching user info deets
router.patch("/me", auth, validateUserUpdate, updateUserProfile);

module.exports = router;
