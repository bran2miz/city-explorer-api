'use strict';

// IMPORTS
const express = require('express');
require('dotenv').config();
const cors = require('cors');

//MODULES
const {handleGetMovies} = require('./modules/movies.js');
const {handleGetWeather} = require('./modules/weather.js');

//GLOBALS
const PORT = process.env.PORT || 3001;
const app = express();

// MIDDLEWARE
app.use(cors());

// const axios = require('axios');

//Setup Routes (Root)
app.get('/', (request, response) => {
  response.status(200).send('Go To: HOME');
});

app.get('/weather', handleGetWeather);

app.get('/movies', handleGetMovies);

// Errors (at the end if no routes match)
app.get('*', errorHandler);
function errorHandler(request, response) {
  response.status(500).send('Something went wrong');
}

//Listen on the port for requests from the client
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));






