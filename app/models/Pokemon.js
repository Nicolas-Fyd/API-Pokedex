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

    /**
     * Gets all Pokemon instances with their types
     * @returns {Pokemon[]} an array of Pokemon instances
     */
    async findAllPokemonsWithTypes() {
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
        GROUP BY p.id, p.name, p.description, p.height, p.weight, p.hp, p.attack, p.defense, p.spe_attack, p.spe_defense, p.speed, p.image
        ORDER BY p.id;`
        }
        const result =  await this.client.query(preparedQuery);
        return result.rows;
    };
};

module.exports = new Pokemon(client);