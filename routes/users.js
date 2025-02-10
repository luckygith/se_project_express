const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  getCurrentUser,
  updateUserProfile,
  createUser,
} = require("../controllers/users");

router.get("/me", auth, getCurrentUser); //Fetching user info deets
router.patch("/me", auth, updateUserProfile);
//PATCH /users/me — update profile

router.post("/", createUser);
module.exports = router;

// REMOVED As in index or private or no public accesss~~~~~~~~~~~~~~
// router.get("/", getUsers); // functions called when routes is hit with a request

// GET /users — returns all users
// GET /users/:userId - returns a user by _id
// POST /users — creates a new user ---------curl -X POST http://localhost:3001/users/123
// In the body of the POST request for creating a user, pass a JSON object with two fields: name and avatar.
// "/:userId
