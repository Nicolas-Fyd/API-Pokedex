const Core = require('./Core');
const client = require('../db/database');
const debug = require('debug')("model:user");

/**
 * A User is an object including a pseudo, an email, a password, a confirmpassword and a role_id
 * @typedef {Object} User
 * @property {string} pseudo - pseudo
 * @property {string} email - email
 * @property {string} password - password
 * @property {string} confirmpassword - confirmpassword
 * @property {number} role_id - role identifyer
 */
class User extends Core {
    tableName = 'user';

    /**
     * Gets a User instance corresponding to a given email
     * @param {string} email user's email
     * @returns {User} a User instance
     */
    async findByEmail(email) {
        const preparedQuery = {
            text : `SELECT * FROM "user" WHERE email = $1`,
            values: [email]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };

    /**
     * Gets a User instance corresponding to a given pseudo
     * @param {string} pseudo user's pseudo
     * @returns {User} a User instance
     */
    async findByPseudo(pseudo) {
        const preparedQuery = {
            text : `SELECT * FROM "user" WHERE pseudo = $1`,
            values: [pseudo]
        }
        const result = await this.client.query(preparedQuery);
        return result.rows[0];
    };
};

module.exports = new User(client);