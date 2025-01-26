const express = require("express"); // connect express server!
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

// INITIALIZE EXPRESS APP
const app = express(); // mk express server inside

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
app.use(express.json());

// DESIGNATED CUSHION FOR USER INFO FOR NOW
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // paste the _id of the test user created in the previous step
  };
  next();
});

app.use("/", mainRouter);
