const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // No token

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user; // Save user info to request
    next();
  });
}

module.exports = authenticateToken;
