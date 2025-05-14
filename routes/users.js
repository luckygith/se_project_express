const router = require("express").Router();
const auth = require("../middlewares/auth");

const { getCurrentUser, updateUserProfile } = require("../controllers/users");

const {validateUserLoginBody, validateUserInfoBody} = require("../middlewares/validation");

router.get("/me", auth, validateUserLoginBody, getCurrentUser); // Fetching user info deets
router.patch("/me", auth, validateUserInfoBody, updateUserProfile);

module.exports = router;
