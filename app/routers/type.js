const { typeController } = require("../controllers/index.js");
const debug = require('debug')("router:type");

const { Router } = require("express");
const typeRouter = Router();

/**
 * @typedef {import('../models/index').Type} Type;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route GET /type
 * @group Type - Getting all existing types
 * @return {Type[]} an array of Type instances
 * @returns {APIError} error
 */
typeRouter.get("/", typeController.getAllTypes);

module.exports = typeRouter;