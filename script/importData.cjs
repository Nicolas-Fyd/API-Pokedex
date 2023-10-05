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
    weight: pokemon.profile.weight,
    hp: pokemon.base.HP,
    attack: pokemon.base.Attack,
    defense: pokemon.base.Defense,
    spe_attack: pokemon.base["Sp. Attack"],
    spe_defense: pokemon.base["Sp. Defense"],
    speed: pokemon.base.Speed,
    image: pokemon.image.hires
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
        filters.push(`($${counter}, $${counter + 1}, $${counter + 2}, $${counter + 3}, $${counter + 4}, $${counter + 5}, $${counter + 6}, $${counter + 7}, $${counter + 8}, $${counter + 9}, $${counter + 10})`);
        values.push(pokemon.name, pokemon.description, pokemon.height, pokemon.weight, pokemon.hp, pokemon.attack, pokemon.defense, pokemon.spe_attack, pokemon.spe_defense, pokemon.speed, pokemon.image);
        counter += 11
    });

    const preparedQuery = {
        text: `
        INSERT INTO pokemon
        (name, description, height, weight, hp, attack, defense, spe_attack, spe_defense, speed, image)
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

// Fonction pour remplir la table "pokemon_type"
async function importPokemonType() {
    await client.query("TRUNCATE pokemon_type CASCADE");

    const filters = [];
    const values = [];
    let counter = 1;

    pokedexObject.forEach(pokemon => {
        pokemon.type.forEach(type => {
            filters.push(`($${counter}, $${counter + 1})`);
            values.push(pokemon.id);
            // Ici, pour chaque type on va chercher l'index du type correspondant et on y ajoute 1 (l'index d'un tableau commençant par 0)
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
