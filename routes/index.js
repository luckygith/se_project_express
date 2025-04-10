const express = require("express"); // connect express server!
const app = express();

const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND_404 } = require("../utils/statusCodes");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// No authentication
router.post("/signup", createUser);
router.post("/signin", login);
router.use("/items", clothingItemRouter);

// Req authentication
router.use("/users", auth, userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_404).send({ message: "Requested route not found" });
});

module.exports = router;

// router.use(auth);
