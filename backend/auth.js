const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("./config");

const generateAccessToken = (user) => {
  return jwt.sign({ username: user.username }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).send("Access Denied");
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }
    req.user = user;
    next();
  });
};

module.exports = { generateAccessToken, authenticateToken };
