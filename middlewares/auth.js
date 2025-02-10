const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const { INCORRECT_INFO_401, BAD_REQUEST_400 } = require("../utils/statusCodes");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers; //gets authorization header from request!

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(BAD_REQUEST_400)
      .send({ message: "Authorization required" });
  } //check if auth

  const token = authorization.replace("Bearer ", ""); //getting token header and removing prefix to leave JWT

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET); //verify token
    // Attaching payload to request obj
    req.user = payload;
    return next();
    //onto next middleware when successful!
  } catch (error) {
    return res.status(INCORRECT_INFO_401).send({ message: "Invalid token" });
  }
  return res;
};

module.exports = auth;
