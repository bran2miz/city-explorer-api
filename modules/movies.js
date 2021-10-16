'use strict';

const axios = require('axios');

class Movie {
  constructor(data) {
    this.data = data;
  }
}

async function handleGetMovies(request,response) {
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
}

module.exports = {handleGetMovies};
