const APIError = require("../services/error/APIError");
const { Pokemon } = require("../models/index");
const debug = require('debug')("controller:pokemon");

/**
 * @typedef {import('../models/index').Pokemon} Pokemon;
 * @typedef {import('../services/error/APIError')} APIError;
 */
const pokemonController = {
    /**
     * Gets all existing pokemons
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {Pokemon[]} an array of Pokemons instances
     * @returns {APIError} error
     */
    async getAllPokemons (req, res, next) {
        try {
            const pokemons = await Pokemon.findAllPokemonsWithTypes();

            res.json(pokemons);
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
        }       
    },
};

module.exports = pokemonController;