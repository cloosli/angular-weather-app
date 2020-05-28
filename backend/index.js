const express = require('express')
const http = require('requestify')
const cors = require('cors')
const path = require('path')
const PORT = process.env.PORT || 5000
const API_KEY = process.env.WEATHER_APP_API

var whitelist = ['https://warm-retreat-51656.herokuapp.com', 'https://weather-chl.web.app']
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            console.log(`Not allowed by CORS: ${origin}`)
            callback(new Error('Not allowed by CORS'))
        }
    }
}

const weahterForecastProxy = (request, response) => {
    /// Get the url params
    const lat = request.query.lat;
    const lng = request.query.lng;

    const url = formatUrl(lat, lng);

    /// Send request to DarkSky
    return http.get(url).then((res) => {
        return response.status(200).send(res.getBody());
    }).catch((err) => {
        console.error(err)
        return response.status(400).send(err)
    })
};

express()
    .use(cors(corsOptions))
    .get('/', (req, res) => res.send('<h1>Status: OK</h1>'))
    .get('/forecast', weahterForecastProxy)
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

/// Helper to format the request URL
function formatUrl(lat, lng) {
    console.log(`get forecast for ${lat}, ${lng}`)
    return `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lng}&cnt=7&units=metric&appid=${API_KEY}`
}
