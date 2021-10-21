'use strict';

const axios = require('axios');

class Forecast{
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

function handleGetWeather(request, response) {
  let lat = request.query.lat;
  let lon = request.query.lon;

  if (lat === undefined || lon === undefined) {
    response.status(500).send('Sorry, I could not process your request');
  }

  try {
    axios
      .get(`http://api.weatherbit.io/v2.0/forecast/daily/?key=${process.env.WEATHER_API_KEY}&lang=en&lat=${lat}&lon=${lon}&days=5`)
      .then((weatherResponse)=> {
        let dailyForecast = getForecast(weatherResponse.data);
        console.log(dailyForecast);
        response.status(200).send(dailyForecast);
      });
  } catch (error) {
    response.status(500).send('Something went wrong with the weather data!');
  }
}

function getForecast(cityData) {
  let foreCastArray = [];
  if (!cityData.status === 200) {
    return foreCastArray;
  }
  cityData.data.forEach((forecast)=> {
    let description = `Low of ${forecast.app_min_temp}, high of ${forecast.app_max_temp}, with ${forecast.weather.description.toLowerCase()}`;
    let date = forecast.datetime;
    foreCastArray.push(new Forecast(date, description));
  });
  return foreCastArray;
}

module.exports = {handleGetWeather};
