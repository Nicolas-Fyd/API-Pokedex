const { userPokemonController } = require("../controllers/index.js");
const debug = require('debug')("router:authentification");

const { Router } = require("express");
const collectionRouter = Router();

/**
 * @typedef {import('../models/index').User} User;
 * @typedef {import('../services/error/APIError.js')} APIError;
 */

/**
 * @route GET /me/collection
 * @group UserPokemon - Getting the user's pokemons collection
 * @returns {UserPokemon[]} an array of UserPokemon instances
 * @returns {APIError} error
 */
collectionRouter.get("/", userPokemonController.getUsersPokemonsCollection);

/**
 * @route POST /me/collection
 * @group UserPokemon - Adding a pokemon in user's collection
 * @returns {void} - No Content (HTTP 200) response
 * @returns {APIError} error
 */
collectionRouter.post("/", userPokemonController.addUserPokemon);

/**
 * @route DELETE /me/collection/:pokemonId
 * @group UserPokemon - Deleting the pokemon from the user's pokemons collection
 * @param {number} pokemonId - The id of the pokemon to delete
 * @returns {void} 204 - No content response
 * @returns {APIError} error
 */
collectionRouter.delete("/:pokemonId(\\d+)", userPokemonController.deleteUserPokemonByIds);


module.exports = collectionRouter;