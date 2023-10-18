const APIError = require("../services/error/APIError");
const { Type } = require("../models/index");
const debug = require('debug')("controller:type");

/**
 * @typedef {import('../models/index').Type} Type;
 * @typedef {import('../services/error/APIError')} APIError;
 */
const typeController = {
    /**
     * Gets all existing Types
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Type[]} an array of Types instances
     * @returns {APIError} error
     */
    async getAllTypes(_, res, next) {
        try {
            const types = await Type.findAll();
            res.json(types);
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
        }       
    },
};

module.exports = typeController;