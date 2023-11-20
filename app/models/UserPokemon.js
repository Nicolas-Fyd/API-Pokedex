const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:role");

/**
 * A UserPokemon is an object including an user_id and a pokemon_id
 * @typedef {Object} UserPokemon
 * @property {number} user_id - user identifyer
 * @property {number} pokemon_id - pokemon identifyer
 */
class UserPokemon extends Core {
    tableName = 'user_has_pokemon';

    /**
     * Gets a specific UserPokemon instance corresponding to a certain user id and pokemon id
     * @param {number} userId user's id
     * @param {number} cardId pokemon's id
     * @returns {UserCard} a UserPokemon instance
     */
    async findUserPokemonByIds (userId, pokemonId) {
        const preparedQuery = {
            text : `SELECT * FROM user_has_pokemon WHERE user_id = $1 AND pokemon_id = $2`,
            values : [userId, pokemonId]
        }
        
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    }
};

module.exports = new UserPokemon(client);