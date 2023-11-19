const APIError = require("../services/error/APIError");
const { User } = require("../models/index");
const debug = require('debug')("controller:user");
const bcrypt = require('bcrypt');

/**
 * @typedef {import('../models/index').Type} Type;
 * @typedef {import('../services/error/APIError')} APIError;
 */
const userController = {
        /**
         * Creates a new user in the User's table
         * @param {object} req Express' request
         * @param {object} res Express' response
         * @param {function} next Express' function executing the succeeding middleware
         * @returns {void} - No Content (HTTP 200) response
         * @returns {APIError} error
         */
        async signUp(req,res,next) {
            const {pseudo, email, password} = req.body;
            console.log(req.body);
    
            // Password encrypting
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(password, salt);
    
            // Creating the new user in the user table, only standard users can be created this way (no admin)
            try {
                await User.create({pseudo, email, password: hashedPassword});
                res.status(200).json();
            } catch (error) {
                debug(error);
                // console.error('Erreur lors de la création de l\'utilisateur :', error);
                // return next(new Error("Erreur lors de l'inscription"));
                return next(new APIError("Erreur lors de l'inscription", 500));
            }
        },
};

module.exports = userController;