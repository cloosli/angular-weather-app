import * as functions from 'firebase-functions';
const http = require('requestify');
const cors = require('cors')({ origin: true });

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const weahterForecastProxy = functions.https.onRequest((request, response) => {
    cors(request, response, () => {
        /// Get the url params
        const lat = request.query.lat;
        const lng = request.query.lng;

        const url = formatUrl(lat, lng);

        /// Send request to DarkSky
        return http.get(url).then((res: any) => {
            return res.status(200).send(res.getBody());
        }).catch((err: any) => {
            return response.status(400).send(err)
        })
    });
});

/// Helper to format the request URL
function formatUrl(lat: any, lng: any) {
    const apiKey = functions.config().openweatherapi.key
    console.log(apiKey)

    return `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lng}&cnt=7&appid=${apiKey}`
}
