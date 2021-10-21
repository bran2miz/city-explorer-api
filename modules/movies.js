const axios = require('axios');
const { notFoundHandler } = require('./notFoundHandler.js');
const cacheDB = require('./cache.js');

async function handleGetMovies(request, response) {
  // console.log(getMovies);
  const {searchQuery} = request.query;
  const movieURL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&query=${searchQuery}&page=1&include_adult=false`;
  const key = searchQuery;
  try{
    if(cacheDB[key]) {
      console.log('cache has data', key);
      cacheDB[key].timestamp = Date.now();
      response.send(cacheDB[key]);
      return;
    } else {
      const MovieResponse = await axios.get(movieURL);
      // console.log(MovieResponse);
      const SortedMovieData = MovieResponse.data.results.sort((a, b) => b.popularity - a.popularity);
      const movieData = SortedMovieData.map(movie => new Movie(movie));
      cacheDB[key] = movieData;
      response.send(movieData);
    }
  }catch(error){
    console.log(error);
    notFoundHandler();
  }

}
class Movie {
  constructor(data) {
    this.data = data;
  }
}

module.exports = { handleGetMovies : handleGetMovies };
