const express = require("express"); // connect express server!
const cors = require("cors");
const mongoose = require("mongoose");
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
app.use(express.json());

// DESIGNATED CUSHION FOR USER INFO FOR NOW
// x

app.use("/", mainRouter);
