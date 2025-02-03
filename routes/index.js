const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND_404 } = require("../utils/statusCodes");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
  res.status(NOT_FOUND_404).send({ message: "Requested route not found" });
});

app.post("/signin", login);
app.post("/signup", createUser);
module.exports = router;
