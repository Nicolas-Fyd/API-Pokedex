// Connexion à la BDD avec les variables d'environnement du fichier .env
require("dotenv").config();
const { Client } = require('pg');
const client = new Client();
client.connect();

// Stockage du fichier JSON
const pokedexObject = require("../data/pokedex.json");

// Création nouveau tableau pour correspondre aux colonnes de la table "pokemon"
const filteredPokedexObject = pokedexObject.map(pokemon => ({
    name: pokemon.name.french,
    description: pokemon.description,
    height: pokemon.profile.height,
    weight: pokemon.profile.weight
}));

// Tableau des types
const pokemonTypes = [
    "Normal",
    "Fire",
    "Water",
    "Grass",
    "Electric",
    "Ice",
    "Fighting",
    "Poison",
    "Ground",
    "Flying",
    "Psychic",
    "Bug",
    "Rock",
    "Ghost",
    "Dragon",
    "Steel",
    "Dark",
    "Fairy"
];

// Fonction pour remplir la table "pokemon"
async function importPokemon() {
    await client.query("TRUNCATE pokemon CASCADE");

    const filters = [];
    const values = [];
    let counter = 1;

    filteredPokedexObject.forEach(pokemon => {
        filters.push(`($${counter}, $${counter + 1}, $${counter + 2}, $${counter + 3})`);
        values.push(pokemon.name, pokemon.description, pokemon.height, pokemon.weight);
        counter += 4
    });

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

// Fonction pour remplir la table "type"
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

async function importPokemonType() {
    await client.query("TRUNCATE pokemon_type CASCADE");

    const filters = [];
    const values = [];
    let counter = 1;

    pokedexObject.forEach(pokemon => {
        // typeLength = pokemon.type.length;

        // const typePlaceholders = Array.from({ length: typeLength }, (_, i) => `$${counter + i}`);
        // filters.push(`(${typePlaceholders.join(',')})`);
        // counter += typeLength;

        pokemon.type.forEach(type => {
            filters.push(`($${counter}, $${counter + 1})`);
            values.push(pokemon.id);
            values.push(pokemonTypes.findIndex(typeInArray => typeInArray === type) + 1);
            counter += 2;
        });
    });

    const preparedQuery = {
        text: `
        INSERT INTO pokemon_type
        (pokemon_id, type_id)
        VALUES
        ${filters.join(',')};`,
        values
    };

    try {
        await client.query(preparedQuery);
        console.log('Insertion des types des pokémons terminés');
    } 
    catch (error) {
        console.error(error);
    }
}

// Fonction qui lance les différentes fonctions qui peuplent la BDD et termine la connexion à la BDD
async function importData() {
    await importPokemon();
    await importTypes();
    await importPokemonType();

    await client.end();
}

importData();
