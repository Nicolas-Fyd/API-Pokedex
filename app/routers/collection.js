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


module.exports = collectionRouter;