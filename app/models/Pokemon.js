const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:pokemon");

/**
 * A Pokemon is an object including pokemon's informations
 * @typedef {Object} Pokemon
 * @property {string} name - name
 * @property {string} description - description
 * @property {string} height - height
 * @property {string} weight - weight
 * @property {number} hp - hp
 * @property {number} attack - attack
 * @property {number} defense - defense
 * @property {number} spe_attack - spe_attack
 * @property {number} spe_defense - spe_defense
 * @property {number} speed - speed
 * @property {string} image - image
 */
class Pokemon extends Core {
    tableName = 'pokemon';
};

module.exports = new Pokemon(client);