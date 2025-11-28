// src/utils/generateToken.js
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { sub: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

module.exports = generateToken;
