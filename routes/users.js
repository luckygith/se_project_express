const router = require("express").Router();

const { getCurrentUser, updateUserProfile } = require("../controllers/users");

router.get("/users/me", getCurrentUser); //Fetching user info deets
router.patch("/users/me", updateUserProfile);
//PATCH /users/me — update profile

module.exports = router;

// REMOVED As in index or private or no public accesss~~~~~~~~~~~~~~
// router.get("/", getUsers); // functions called when routes is hit with a request
// router.post("/", createUser);

// GET /users — returns all users
// GET /users/:userId - returns a user by _id
// POST /users — creates a new user ---------curl -X POST http://localhost:3001/users/123
// In the body of the POST request for creating a user, pass a JSON object with two fields: name and avatar.
// "/:userId
