const APIError = require("../error/APIError");
const jwt = require('jsonwebtoken');

const authentificationMiddleware = {
  
    /**
     * Middleware allowing only logged users to continue
     * @param {object} req Express' request
     * @param {object} _ Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No content - Allowing to go to the next middleware
     * @returns {APIError} error
     */
    isAuthenticated(req, _, next) {
      const authHeader = req.headers.authorization;
      //authHeader's authorization format is "Bearer token" hence the .split(' ')[1]
      const token = authHeader && authHeader.split(' ')[1];
  
      if (!token) return next(new APIError('Veuillez vous authentifier pour accéder à cette page.', 401));
  
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return next(new APIError("Vous n'êtes pas autorisé à accéder à cette page.", 401));
        }
        req.user = user;
        next();
      });
    }
  
  }
  
  module.exports = authentificationMiddleware;