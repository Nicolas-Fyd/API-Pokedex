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
            text : `SELECT * FROM user_has_pokemon WHERE user_id = $1 AND pokemon_id = $2;`,
            values : [userId, pokemonId]
        }
        
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };

    async findAllUsersPokemons(userId) {
        const preparedQuery =  {
            text: `
            SELECT 
            p.id, 
            p.name, 
            p.description, 
            p.height, 
            p.weight,
            json_build_object(
                'hp', p.hp,
                'attack', p.attack,
                'defense', p.defense,
                'spe_attack', p.spe_attack, 
                'spe_defense', p.spe_defense, 
                'speed', p.speed
            ) stats,
            (
                SELECT ARRAY_AGG(
                    json_build_object(
                        'name', t.name,
                        'color', t.color
                    ) ORDER BY t.name ASC
                )
                FROM pokemon_type pt
                JOIN type t ON t.id = pt.type_id
                WHERE pt.pokemon_id = p.id
            ) types,
            (
                SELECT ARRAY_AGG(
                    json_build_object(
                        'state', e.state,
                        'evolutionId', e.evolutionid,
						'evolutionName', (SELECT p2.name FROM pokemon p2 WHERE p2.id = CAST(e.evolutionid AS INTEGER)),
                        'condition', e.condition
                    ) ORDER BY e.evolutionid ASC
                )
                FROM evolution e
                WHERE e.pokemon_id = p.id
            ) evolution,
            p.image,
            p.sprite,
            p.thumbnail,
            (
                SELECT ARRAY_AGG(
                    json_build_object(
                        'typecoverage_id', thw.typecoverage_id,
                        'name_typecoverage', tc.name,
                        'color_typecoverage', tc.color,
                        'multiplier', w.multiplier
                    ) ORDER BY thw.typecoverage_id ASC
                )
                FROM type T
                JOIN type_has_weaknessandresist thw ON t.id = thw.type_id
                JOIN weaknessandresist w ON w.id = thw.weaknessandresist_id
                JOIN type tc ON tc.id = thw.typecoverage_id
                WHERE t.id = ANY (
                    SELECT pt.type_id
                    FROM pokemon_type pt
                    WHERE pt.pokemon_id = p.id
                )
            ) AS weakness_and_resist
        FROM pokemon p
        JOIN user_has_pokemon uhp ON uhp.pokemon_id = p.id
		WHERE uhp.user_id = $1
        GROUP BY p.id, p.name, p.description, p.height, p.weight, p.hp, p.attack, p.defense, p.spe_attack, p.spe_defense, p.speed, p.image
        ORDER BY p.id;`,
        values : [userId]
        }
        const result =  await this.client.query(preparedQuery);
        return result.rows;
    };

    /**
     * Deletes a specific UserPokemon instance corresponding to a certain user id and pokemon id
     * @param {number} userId - instance's user's id
     * @param {number} pokemonId - instance's pokemon's id
     * @returns {number} number of deleted rows
     */
    async deleteUserPokemon(userId, pokemonId) {
        const preparedQuery = {
            text : `DELETE FROM user_has_pokemon
            WHERE user_id = $1 AND pokemon_id = $2`,
            values: [userId, pokemonId]
        }
        const result = await this.client.query(preparedQuery);
        return result.rowCount;
    };

};

module.exports = new UserPokemon(client);