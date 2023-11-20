const APIError = require("../services/error/APIError");
const { UserPokemon } = require("../models/index");
const debug = require('debug')("controller:usercard");

/**
 * @typedef {import('../models/index').UserPokemon} UserPokemon;
 * @typedef {import('../services/error/APIError')} APIError;
 */

const userPokemonController = {
    
    /**
     * Creates a new instance in the user_pokemon's table
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {UserPokemon} the created UserPokemon instance
     */
    async addUserPokemon (req, res, next) {
        try {
            // checking if the pokemon is already in the user's pokemon collection
            const userPokemons = await UserPokemon.findUserPokemonByIds(req.user.id, req.body.pokemonId);

            if(userPokemons) {
                return next(new APIError(`Ce pokemon est déjà dans votre collection.`,400));
            } 

            const userPokemon = await UserPokemon.create({ user_id : req.user.id, pokemon_id : req.body.pokemonId })
            res.json(userPokemon);

        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
        }
    }
};

module.exports = userPokemonController;