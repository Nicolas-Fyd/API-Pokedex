const APIError = require("../services/error/APIError");
const { User } = require("../models/index");
const debug = require('debug')("controller:user");
const bcrypt = require('bcrypt');
const authentificationToken = require('../services/JWT/generateToken');

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

        /**
     * Verifies a user's connexion form using their email and password
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {object} return an object with jwt's access token, user's firstname, role_id, ecocoins and score
     * @returns {APIError} error
     */
    async signIn (req,res,next) {
        const { email, password } = req.body;
        
        try {
            // Checking if an account exists with this email
            const user = await User.findByEmail(email);
            if(!user) {
                return next(new APIError('Couple login/mot de passe est incorrect.', 401));
            }
            // Checking if the password is matching
            const hasMatchingPassword = await bcrypt.compare(password, user.password);
            if(!hasMatchingPassword) {
                return next(new APIError('Couple login/mot de passe est incorrect.', 401));
            }

            // Generating a token containing only the necessary information
            const accessToken = authentificationToken.generateAccessToken({id : user.id, role_id: user.role_id});
            const refreshToken = authentificationToken.generateRefreshToken({id : user.id, role_id: user.role_id});

            res.json({ 
                accessToken,
                refreshToken, 
                pseudo : user.pseudo,
                role_id : user.role_id,
            });
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
        }

     },
};

module.exports = userController;