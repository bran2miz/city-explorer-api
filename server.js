'use strict';

// IMPORTS
const express = require('express');
require('dotenv').config();
const cors = require('cors');

//GLOBALS
const PORT = process.env.PORT || 3001;
const app = express();
const axios = require('axios');

// MIDDLEWARE
app.use(cors());

// const axios = require('axios');

//Setup Routes (Root)
app.get('/', (request, response) => {
  response.status(200).send('Go To: HOME');
});

// Constructor Classes (state)

class Forecast{
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

class Movie {
  constructor(data) {
    this.data = data;
  }
}

//(GET)
app.get('/weather', async (request, response) => {
  const lat = request.query.lat;
  const lon = request.query.lon;
  const weatherUrl = `http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`;
  try {
    const weatherResponse = await axios.get(weatherUrl);
    const forecastArr = arr => {

      return arr.map(obj => {
        return new Forecast (obj.datetime, `Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description}`);
      });};
    response.status(200).send(forecastArr(weatherResponse.data.data));
  } catch (error) {
    console.error(error.message);
  }


});

app.get('/movies', async (request, response) => {
  try {
    const { searchQuery } = request.query;
    let resultsArray = [];
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${searchQuery}&page=1`;
    let moviesResponse = await axios.get(url);
    moviesResponse.data.results.map(movie => {
      resultsArray.push(new Movie (movie));
    });
    response.send(resultsArray);
  } catch (error) {
    console.log(error);
    response.status(404).send('Something went wrong with requested movie data!');
  }
});

// Errors (at the end if no routes match)
app.get('*', errorHandler);
function errorHandler(request, response) {
  response.status(500).send('Something went wrong');
}

//Listen on the port for requests from the client
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));






