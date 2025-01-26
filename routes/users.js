// import express and call it router to create router!
const router = require("express").Router();
// import all data for specific router

const { getUsers, getUserId, createUser } = require("../controllers/users");

router.get("/", getUsers); // functions called when routes is hit with a request
router.get("/:userId", getUserId);
router.post("/", createUser);

// GET /users — returns all users
// GET /users/:userId - returns a user by _id
// POST /users — creates a new user ---------curl -X POST http://localhost:3001/users/123
// In the body of the POST request for creating a user, pass a JSON object with two fields: name and avatar.

module.exports = router;
