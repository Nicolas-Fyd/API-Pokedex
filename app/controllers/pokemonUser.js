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
    },

    /**
     * Gets all pokemons belonging to a user's collection
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @return {UserPokemon[]} an array of UserPokemon instances
     * @returns {APIError} error
     */
        async getUsersPokemonsCollection (req, res, next) {
            try {
                const userPokemons = await UserPokemon.findAllUsersPokemons(req.user.id);
    
                res.json(userPokemons);
            } catch (error) {
                return next(new APIError(`Erreur interne : ${error}`,500));
            }        
        },

    /**
     * Deletes an instance in the user-has-pokemon's table
     * @param {object} req Express' request
     * @param {object} res Express' response
     * @param {function} next Express' function executing the succeeding middleware
     * @returns {void} - No Content (HTTP 204) response
     */
    async deleteUserPokemonByIds (req, res, next) {
        try {
            const pokemon = await UserPokemon.deleteUserPokemon(req.user.id, req.params.pokemonId);

            if(!pokemon) {
                return next(new APIError(`Ce pokemon n'a pas pu être supprimé car il ne fait pas parti de la collection de l'utilisateur.`,400));
            } else {
                res.status(204).json();
            }
        } catch (error) {
            return next(new APIError(`Erreur interne : ${error}`,500));
        }
    }
};

module.exports = userPokemonController;