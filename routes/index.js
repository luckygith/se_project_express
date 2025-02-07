const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { NOT_FOUND_404 } = require("../utils/statusCodes");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND_404).send({ message: "Requested route not found" });
});

//No authentication
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItemRouter);

//Req authentication
router.use(auth);
router.use("/users", auth, userRouter);

module.exports = router;
