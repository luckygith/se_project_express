const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, updateUserProfile } = require("../controllers/users");

const {validateUserLoginBody, validateUserInfoBody} = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser); // Fetching user info deets
router.patch("/me", auth, updateUserProfile);

module.exports = router;
