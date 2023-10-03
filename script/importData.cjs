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

const pokemonTypes = [
    "Normal",
    "Feu",
    "Eau",
    "Plante",
    "Électrik",
    "Glace",
    "Combat",
    "Poison",
    "Sol",
    "Vol",
    "Psy",
    "Insecte",
    "Roche",
    "Spectre",
    "Dragon",
    "Acier",
    "Ténèbres",
    "Fée"
  ];

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
}

async function importTypes() {
    await client.query("TRUNCATE type CASCADE")

    const filters = [];
    let counter = 1;

    pokemonTypes.forEach(type => {
        filters.push(`($${counter})`);
        counter += 1;
    })

    const preparedQuery = {
        text: `
        INSERT INTO type
        (name)
        VALUES
        ${filters};`,
        values: pokemonTypes
    };

    try {
        await client.query(preparedQuery);
        console.log('Insertion des types terminés');
    } 
    catch (error) {
        console.error(error);
    }
}

async function importData() {
    await importPokemon();
    await importTypes();

    await client.end();
}

importData();
