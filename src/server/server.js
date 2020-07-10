// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

//Dependencies needed to run app
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser');
const cors = require('cors');
const request = require('request-promise');
const { check, validationResult } = require('express-validator');

// Middleware: Configure express to use body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

//  Initialize the main project folder
app.use(express.static('dist'));

// Set up the server
const port = 8001;
app.listen(port, listening);

// Callback to debug
function listening() {
    console.log(`running on localhost: ${port}`);
}





// Post Route- Validation of data from travel form input
app.post('/travel', [
    check('streetnumber').not().isEmpty(),
    check('streetname').not().isEmpty(),
    check('streettype').not().isEmpty(),
    check('city').not().isEmpty(),
    check('datefrom').not().isEmpty(),
], (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {

        req.body.status = "ERROR"
        req.body.error = ""

        console.log('___ERRORS___')

        errors.array().forEach(function (obj) {

            if (req.body.error != '') {
                req.body.error += ', '
            }

            switch (obj.param) {
                case 'streetnumber':
                    req.body.error += 'Need Valid Address Information for Destination';
                    break;
                case 'streetname':
                    req.body.error += 'Need Valid Address Information for Destination';
                    break;
                case 'streetnumber':
                    req.body.error += 'Need Valid Address Information for Destination';
                    break;
                case 'streettype':
                    req.body.error += 'Need Valid Address Information for Destination';
                    break;
                case 'streetnumber':
                    req.body.error += 'Need Valid Address Information for Destination';
                    break;
                case 'city':
                    req.body.error += 'Need Valid City for Destination';
                    break;
                case 'datefrom':
                    req.body.error += 'When are you leaving';
                    break;
                  }

        });

    } else {
        req.body.status = "SUCCESS"
        req.body.error = ""
    }


    processTravelData(req, res)

})

// Process travel data - Validate Input, call APIs, return weather data, image link, errors

async function processTravelData(req, res) {

    // variables
    let longitude;
    let latitude;
    let weatherSummary;
    let weatherIcon;
    let imageLink;
    let geonamesSuccess = false;
    let weatherbitSuccess = false;

    // calculate countdown
    let presentDate = new Date();
    let travelDate = new Date(req.body.datefrom)
    let countDownDays = Math.floor((travelDate.getTime() - presentDate.getTime()) / (1000 * 3600 * 24)) + 1;

    // get location from Geonames API and fetch first entry
    // Username in process.env.GEONAMES_USERNAME
    let geonamesURL = 'http://api.geonames.org/geoCodeAddress?q=' + req.body.streetnumber + "+" + req.body.streetname + "+" + req.body.streettype + "+" + req.body.city + "&username=" + process.env.GEONAMES_USERNAME

    await request(geonamesURL, function (err, response, body) {
        if (err) {
            req.body.error = "Error in call to Geonames API";
        } else {
            let geonamesData = JSON.parse(body);
            if (geonamesData.postalCodes[0] == undefined) {
                req.body.error = "Geo Coordinates of Destination Address not found";
            }
            else {
                longitude = geonamesData.postalCodes[0].lng;
                latitude = geonamesData.postalCodes[0].lat;
                geonamesSuccess = true;
            }
        }
    });

    // get weather data from WEATHERBIT API
    let weatherbitURL = 'https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_API_KEY}&units=I'

    if (geonamesSuccess) {
        console.log("::: Now get the Weather Data :::", weatherbitURL);

        await request(weatherbitURL, function (err, response, body) {
            if (err) {
                req.body.error = "Error in call to Weatherbit API";
            } else {
                let weatherbitData = JSON.parse(body);
                if (weatherbitData.daily == undefined) {
                    req.body.error = "Weather data point daily not found - API error";
                } else {
                    weatherSummary = weatherbitData.daily.data[0].summary;
                    weatherIcon = weatherbitSuccessData.daily.data[0].icon;
                    weatherbitSuccess = true;
                }
            }
        });
    }

    // get image link from Pixabay API
    let pixabayURL = 'https://pixabay.com/api/?key=' + process.env.PIXABAY_API_KEY + '&q=' + req.body.destination + ' &image_type=photo'

    if (weatherbitSuccess) {
        console.log("::: Now get the Pixabay image :::", pixabayURL);

        await request(pixabayURL, function (err, response, body) {
            if (err) {
                req.body.error = "Error in call to Pixabay API";
            } else {
                let pixabayData = JSON.parse(body);
                if (pixabayData.hits[0] == undefined) {
                    req.body.error = "No Image of destionation found";
                } else {
                    imageLink = pixabayData.hits[0].webformatURL;
                }
            }
        });
    }

    // set error status
    if (req.body.error != "") {
        req.body.status = 'ERROR';
    }

    let travelData = {
        city: req.body.city,
        datefrom: req.body.datefrom,
        daysleft: "Adventure in " + req.city + " starts in " + countDownDays + " days from today!",
        summary: weatherSummary,
        imagelink: imageLink,
        status: req.body.status,
        error: req.body.error
    }

    console.log('::: POST Data :::')
    console.log(travelData)

    return res.send(travelData);

}
