require("dotenv").config();

const { Client } = require('pg');

const client = new Client();
client.connect();

const pokedexObject = require("../data/pokedex.json");

const filteredPokedexObject = pokedexObject.map(pokemon => ({
    name: pokemon.name.french,
    description: pokemon.description,
    height: pokemon.profile.height,
    weight: pokemon.profile.weight
}));

async function importPokemon() {
    await client.query("TRUNCATE pokemon CASCADE");

    const filters = [];
    const values = [];
    let counter = 1;

    filteredPokedexObject.forEach(pokemon => {
        filters.push(`($${counter}, $${counter + 1}, $${counter + 2}, $${counter + 3})`);
        values.push(pokemon.name, pokemon.description, pokemon.height, pokemon.weight);
        counter += 4
    })

    const preparedQuery = {
        text: `
        INSERT INTO pokemon
        (name, description, height, weight)
        VALUES
        ${filters.join(',')};`,
        values
    };

    try {
        await client.query(preparedQuery);
        console.log('Insertion des pokémons terminés');
    } 
    catch (error) {
        console.error(error);
    }
    
    await client.end()
}

importPokemon()

