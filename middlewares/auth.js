const jwt = require("jsonwebtoken");

const { INCORRECT_INFO_401 } = require("../utils/statusCodes");

const {UnauthorizedError} = require("../errors/unauthorized-error")
const {ForbiddenError} = require("../errors/forbidden-error")

const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers; // gets authorization header from request!

  if (!authorization || !authorization.startsWith("Bearer ")) {
    // return res
    //   .status(INCORRECT_INFO_401)
    //   .send({ message: "Authorization required" });
    throw new UnauthorizedError("Unauthorized error: missing or invalid token")

  }
  const token = authorization.replace("Bearer ", ""); // getting token header and removing prefix to leave JWT

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET); // verify token
    // Attaching payload to request obj
    req.user = payload;
    return next();
    // onto next middleware when successful!
  } catch (error) {
    throw new ForbiddenError("Unauthorized error: unsuccessful request")
  }
};

module.exports = auth;
