require("dotenv").config();
const { errorHandler } = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const express = require("express"); // connect express server!
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");


// INITIALIZE EXPRESS APP
const app = express(); // mk express server inside

app.use(cors());

// run on port 3001
const { PORT = 3001 } = process.env;

// CONNECT TO MONGODB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("CONNECTED TO DB");
  })
  .catch(console.error);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// USE ROUTER
app.use(requestLogger);
app.use(express.json());

// App's router
app.use("/", mainRouter);

app.use(errorLogger); // enabling error loger after routes and before error

// celebrate's speial error middleware for sending errors to user before custom  centralized error handler
app.use(errors());

// centralized handler
app.use(errorHandler);
