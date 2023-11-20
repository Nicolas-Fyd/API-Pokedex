const APIError = require("../error/APIError");
const { User} = require("../../models/index");
const { userSchema } = require("./schema");
const debug = require("debug")("validation");

/**
 * @typedef {import('../services/error/APIError')} APIError;
 */

const validationModule = {
    /**
   * Validates the provided User object in order to create it
   * @param {object} req Express' request
   * @param {object} _ Express' response
   * @param {function} next Express' function executing the succeeding middleware
   * @returns {void} - No content - Allowing to go to the next middleware
   * @returns {APIError} error
   */
    async validateUserCreation(req, _, next) {
        // Testing email uniqueness
        try {
            const userEmail = await User.findByEmail(req.body.email);
            if(userEmail) {
                next(new APIError('Cet email est déjà pris.', 400));
            }
            const userPseudo = await User.findByPseudo(req.body.pseudo);
            if(userPseudo) {
                next(new APIError('Ce pseudo est déjà pris.', 400));
            }
        } catch (error) {
            debug(error);
            next(new APIError(`Erreur interne : ${error}`,500));
        }

        // The goal here is to send to the front a detailed error
        const { error } = userSchema.validate(req.body);
        if (error) {
            next(new APIError(error.message, 400));
        }
        else {
            next();
        }  
    },
};

module.exports = validationModule;