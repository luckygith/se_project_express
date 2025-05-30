const express = require("express");
 // connect express server!
const app = express();

const router = require("express").Router();
const {validateUserInfoBody, validateUserLoginBody} =require("../middlewares/validation")

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const NotFoundError = require("../errors/not-found-error");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// No authentication
router.post("/signup", validateUserInfoBody, createUser);
router.post("/signin", validateUserLoginBody, login);
router.use("/items", clothingItemRouter);

// Req authentication
router.use("/users", auth, userRouter);

router.use((req, res, next) => {
next(new NotFoundError("Requested route not found"))
});

module.exports = router;

// router.use(auth);
