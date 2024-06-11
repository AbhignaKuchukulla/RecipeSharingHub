const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  // Get bearer token from headers of request
  const bearerToken = req.headers.authorization;
  
  // If bearer token is not available
  if (!bearerToken) {
    return res.status(401).send({ message: "Unauthorized access. Please login to continue" });
  }
  
  // Extract token from bearer token
  const token = bearerToken.split(' ')[1];
  
  // Verify the token
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach the decoded token data to the request object
    next();
  } catch (err) {
    return res.status(401).send({ message: "Invalid token. Please login again" });
  }
}

module.exports = verifyToken;
