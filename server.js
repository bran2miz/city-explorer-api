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

class Forecast{
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

class Films{
  constructor(title, overview, average_votes, total_votes, popularity, released) {
    this.title = title;
    this.overview = overview;
    this.average_votes = average_votes;
    this.total_votes = total_votes;
    this.popularity = popularity;
    this.released = released;
  }
}


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
  const searchQuery = request.query.searchQuery;

  const movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${searchQuery}&page=1&include_adult=false`;
  try{
    const movieResponse = await axios.get(movieUrl);
    console.log(movieResponse.data.results);

    const filmsArr = arr => {

      return arr.map(obj => {

        return new Films (obj.title, obj.overview, obj.votes_average, obj.votes_total, obj.popularity, obj.release_date);

      });

    };
    response.status(200).send(filmsArr(movieResponse.data.results));

  } catch (error) {
    console.error(error.message);
  }
});

// Errors (at the end if no routes match)
app.get('*', errorHandler);
function errorHandler(request, response) {
  response.status(500).send('Something went wrong');
}

//Listen on the port for requests from the client
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));






