require("dotenv").config();
const cors = require('cors');
const express = require("express");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const { pokemonRouter, typeRouter } = require("./app/routers/index");

app.use("/pokemon", pokemonRouter);
app.use("/type", typeRouter);

// Error management
const errorModule = require("./app/services/error/errorHandling");
// 404 error
app.use(errorModule._404);
app.use(errorModule.manage);

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});