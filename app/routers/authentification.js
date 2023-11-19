const { userController } = require("../controllers/index.js");
const debug = require('debug')("router:authentification");
const validationModule = require("../services/validation/validate");

const { Router } = require("express");
const authentificationRouter = Router();

/**
 * @typedef {import('../models/index').User} User;
 * @typedef {import('../services/error/APIError')} APIError;
 */

/**
 * @route POST /sign-up
 * @group User - Managing sign up
 * @returns {void} - No Content (HTTP 200) response
 * @returns {APIError} error
 */
authentificationRouter.post("/sign-up", validationModule.validateUserCreation, userController.signUp);

module.exports = authentificationRouter;