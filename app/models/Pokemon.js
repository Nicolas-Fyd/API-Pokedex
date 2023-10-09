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
            ARRAY_AGG(
                t.name
            ) types,
            p.image
        FROM pokemon p
        JOIN pokemon_type pt ON p.id = pt.pokemon_id
        JOIN type t ON t.id = pt.type_id
        GROUP BY p.id, p.name, p.description, p.height, p.weight, p.hp, p.attack, p.defense, p.spe_attack, p.spe_defense, p.speed, p.image
        ORDER BY p.id;`
        }
        const result =  await this.client.query(preparedQuery);
        return result.rows;
    };
};

module.exports = new Pokemon(client);