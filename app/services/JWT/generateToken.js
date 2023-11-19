const APIError = require("../error/APIError");
const jwt = require('jsonwebtoken');

/**
 * @typedef {import('../../models/index').User} User;
 * @typedef {import('../../services/error/APIError')} APIError;
 */

const authentificationToken = {
  /**
   * Creates a JWT access token
   * @param {User} user.body.required - User Object
   * @returns {string} JWT access token
   */
  generateAccessToken(user) {
    // expires in 30 minutes
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' });
  },

  /**
   * Creates a JWT refresh token
   * @param {User} user.body.required - User Object
   * @returns {string} JWT access token
   */
  generateRefreshToken(user) {
    // expires in 10 hours
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10h' });
  },
};

module.exports = authentificationToken;