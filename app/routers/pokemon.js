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
 * @return {Pokemon[]} an array of Pokemon instances
 * @returns {APIError} error
 */
pokemonRouter.get("/", pokemonController.getAllPokemons);

/**
 * @route GET /pokemon/:id
 * @group Pokemon - Getting a pokemon by his id
 * @return {Pokemon} a Pokemon instance
 * @returns {APIError} error
 */
pokemonRouter.get("/:id(\\d+)", pokemonController.getPokemonById);

module.exports = pokemonRouter;