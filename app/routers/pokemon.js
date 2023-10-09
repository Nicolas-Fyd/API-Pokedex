const { pokemonController } = require("../controllers/index.js");
const debug = require('debug')("router:pokemon");

const { Router } = require("express");
const pokemonRouter = Router();

/**
 * @typedef {import('../models/index').Pokemon} Pokemon;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route GET /pokemon
 * @group Pokemon - Getting all existing pokemons
 * @return {Pokemon[]} an array of pokemon instances
 * @returns {APIError} error
 */
pokemonRouter.get("/pokemon", pokemonController.getAllPokemons);

module.exports = pokemonRouter;