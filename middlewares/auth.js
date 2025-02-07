const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const { INCORRECT_INFO_401 } = require("../utils/statusCodes");
const JWT_SECRET = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers; //gets authorization header from request!

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(INCORRECT_INFO_401)
      .send({ message: "Authorization required" });
  } //check if auth

  const token = authorization.replace("Bearer ", ""); //getting token header and removing prefix to leave JWT

  try {
    const payload = jwt.verify(token, JWT_SECRET); //verify tokenn
    req.user = payload; // Attaching payload to request obj!
    next(); //onto next middleware when successful!
  } catch (error) {
    return res.status(INCORRECT_INFO_401).send({ message: "Invalid token" });
  }
};

module.exports = auth;
