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

const typeColors = [
    "#A8A878",
    "#F08030",
    "#6890F0",
    "#78C850",
    "#F8D030",
    "#98D8D8",
    "#C03028",
    "#A040A0",
    "#E0C068",
    "#A890F0",
    "#F85888",
    "#A8B820",
    "#B8A038",
    "#705898",
    "#7038F8",
    "#B8B8D0",
    "#705848",
    "#EE99AC"
  ];
  
const pokemonTypesAndColors = [
    "Normal", "#A8A878",
    "Fire", "#F08030",
    "Water", "#6890F0",
    "Grass", "#78C850",
    "Electric", "#F8D030",
    "Ice", "#98D8D8",
    "Fighting", "#C03028",
    "Poison", "#A040A0",
    "Ground", "#E0C068",
    "Flying", "#A890F0",
    "Psychic", "#F85888",
    "Bug", "#A8B820",
    "Rock", "#B8A038",
    "Ghost", "#705898",
    "Dragon", "#7038F8",
    "Steel", "#B8B8D0",
    "Dark", "#705848",
    "Fairy", "#EE99AC"
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
        filters.push(`($${counter}, $${counter + 1})`);
        counter += 2;
    })

    const preparedQuery = {
        text: `
        INSERT INTO type
        (name, color)
        VALUES
        ${filters.join(',')};`,
        values: pokemonTypesAndColors
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

// Fonction pour remplir la table "evolution"
async function importEvolution() {
    await client.query("TRUNCATE evolution CASCADE");

    const filters = [];
    const values = [];
    let counter = 1;
    const insertQueries = [];

    // On va vérifier pour chaque pokemon si il existe des évolutions précédentes ou suivantes
    // Puis on va les push dans le tableau insertQueries
    pokedexObject.forEach((pokemon) => {
        // Si une évolution précédente existe on push les données dans l'ordre de la table
        if (pokemon.evolution.prev) {
                const [prevId, condition] = pokemon.evolution.prev;
                if (prevId && condition) {
                    insertQueries.push([
                        'prev',
                        prevId,
                        condition,
                        pokemon.id,
                    ]);
                }
        };

        // Si une évolution suivante existe on push les données dans l'ordre de la table
        // Attention le json récupéré est différent entre precédent/suivant (double tableau pour les suivantes)
        if (pokemon.evolution.next) {
            pokemon.evolution.next.forEach((evolution) => {
                const [nextId, condition] = evolution;
                if (condition) {
                    insertQueries.push([
                        'next',
                        nextId,
                        condition,
                        pokemon.id,
                    ]);   
                }
            });
        };
    });

    // Pour chaque query du tableau, on va push des placeholders (en fonction du nombre de colonnes) dans le tableau filter, push les valeurs dans le tableau values et ajouter a counter le nombre correspondant de colonnes
    insertQueries.forEach((query) => {
        filters.push(`($${counter}, $${counter + 1}, $${counter + 2}, $${counter + 3})`);
        values.push(...query);
        counter += 4;
    });

    // Requête unique pour insérer toutes les données dans la table evolution
    const preparedQuery = {
        text: `
        INSERT INTO evolution
        ("state", "evolutionId", "condition", "pokemon_id")
        VALUES
        ${filters.join(',')};`,
        values
    };

    try {
        await client.query(preparedQuery);
        console.log('Insertion des évolutions terminés');
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
    await importEvolution();

    await client.end();
}

importData();
