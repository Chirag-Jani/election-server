// * this middleware will check for auth-token only in the headers

const jwt = require("jsonwebtoken");
const JWT_SECRET = "chiragJaniSecret01";

const getUser = async (req, res, next) => {
  // * get user from jwt and add id to req object
  const token = req.header("auth-token");

  // * checking for valid token
  if (!token) {
    res.status(401).json({ error: "Access Denied" });
  }

  try {
    // * verifying token
    const data = jwt.verify(token, JWT_SECRET);

    // * setting user in req object
    req.user = data.user;

    // * calling next function which will be the callback in any request
    next();
  } catch (error) {
    res.status(401).json({ error: "Access Denied" });
  }
};

module.exports = getUser;
