'use strict';

const axios = require('axios');

class Forecast{
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

async function handleGetWeather(request, response) {
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

}

module.exports = {handleGetWeather};
