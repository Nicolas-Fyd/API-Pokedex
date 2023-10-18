const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:type");

/**
 * A Type is an object including Type's name
 * @typedef {Object} Type
 * @property {string} name - name
 */
class Type extends Core {
    tableName = 'type';

};

module.exports = new Type(client);