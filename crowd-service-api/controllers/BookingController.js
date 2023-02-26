import mongoose, { mongo } from "mongoose"
import { bookingSchema } from "../models/Booking.js"
import config from "config"
import rp from "request-promise"
import { response } from "express"
import { getDistance } from "geolib"
import { ApiKeyManager } from '@esri/arcgis-rest-request'
import { geocode } from '@esri/arcgis-rest-geocoding'

const apiKey = config.get('arcgis').apiKey;
//const apiKey = "AAPK65c71819bad7482682beb8e7e688d19aIWG4NNM_VT8e_aNF9YHzOmJCsMIakJDJmwLEsvbgONRyrg0sjzBaDGd9VvHr0EON";
const authentication = ApiKeyManager.fromKey(apiKey);
const Booking = mongoose.model("Booking", bookingSchema)
const providerBaseURL = config.get('providers').baseURL;


export const searchNearestProviders = async(req, res) => {
    try {
        var fromAddress = req.body.from;
        var filteredProviders = new Array();
        await createBooking(req.body);

        // Retrieve a list of providers by the current postcode and job id
        let providers = await getProvidersByPostCodeAndJobId(fromAddress.country, req.body.jobId);

        if (providers.length === 0) {
            res.send(filteredProviders);
        }

        // Filtering the given providers by matching attributes configuration
        filteredProviders = await searchByMatchingAttributes(providers, req.body.jobId, fromAddress);
        res.send(filteredProviders);
    } catch (err) {
        res.status(500).json({
            message: err.toString()
        })

    }
};

// Convert address to latitude and longitude
export const convertAddressToLocation = async(address) => {
    return new Promise(function(resolve, reject) {
        geocode({
            address: address.street,
            postal: address.postcode,
            countryCode: address.country,
            authentication
        }).then((response) => {
            resolve(response.candidates[0].location);
        });
    });
}

export const searchByMatchingAttributes = async(providers, jobId, fromAddress) => {
    var key, filteredProviders, expr, i, index = 0;

    var currentProviders = providers;
    var attributes = await getMatchingAttributesByProviderCodeAndJobId(jobId);
    var sortAttributes = attributes[0]["matchingAttributes"];

    var keys = sortAttributes.map(a => a.name);
    const values = sortAttributes.map(a => a.value);
    const operators = sortAttributes.map(a => a.operator)

    var location = await convertAddressToLocation(fromAddress);
    var currentCoord = { lat: location.y, lng: location.x }
    const coords = providers.map(a => a.location);

    var distFromCurrent = function(coord) {
        return { coord: coord, dist: getDistance(currentCoord, coord) };
    }
    var distances = coords.map(distFromCurrent);

    for (const operator of operators) {
        expr = operator.toLowerCase();
        key = keys[index];
        switch (expr) {
            case 'eq':
                if (keys[index].toLowerCase() == 'location') {
                    i = -1;
                    filteredProviders = currentProviders.filter(provider => {
                        i++;
                        return provider.hasOwnProperty(key) && distances[index].dist == parseInt(values[index])
                    })
                } else {
                    filteredProviders = currentProviders.filter(provider => {
                        return provider.hasOwnProperty(key) && parseInt(provider[key]) == parseInt(values[index])
                    })
                }
                break;
            case 'gt':
                if (keys[index].toLowerCase() == 'location') {
                    i = -1;
                    filteredProviders = currentProviders.filter(provider => {
                        i++;
                        return provider.hasOwnProperty(key) && distances[index].dist > parseInt(values[index])
                    })
                } else {
                    filteredProviders = currentProviders.filter(provider => {
                        return provider.hasOwnProperty(key) && parseInt(provider[key]) > parseInt(values[index])
                    })
                }
                break;
            case 'ge':
                if (keys[index].toLowerCase() == 'location') {
                    i = -1;
                    filteredProviders = currentProviders.filter(provider => {
                        i++;
                        return provider.hasOwnProperty(key) && distances[index].dist >= parseInt(values[index])
                    })
                } else {
                    filteredProviders = currentProviders.filter(provider => {
                        return provider.hasOwnProperty(key) && parseInt(provider[key]) >= parseInt(values[index])
                    })
                }
                break;
            case 'lt':
                if (keys[index].toLowerCase() == 'location') {
                    i = -1;
                    filteredProviders = currentProviders.filter(provider => {
                        i++;
                        return provider.hasOwnProperty(key) && distances[i].dist < parseInt(values[index])
                    })
                } else {
                    filteredProviders = currentProviders.filter(provider => {
                        return provider.hasOwnProperty(key) && parseInt(provider[key]) < parseInt(values[index])
                    })
                }
                break;
            case 'le':
                if (keys[index].toLowerCase() == 'location') {
                    i = -1;
                    filteredProviders = currentProviders.filter(provider => {
                        i++;
                        return provider.hasOwnProperty(key) && distances[index].dist <= parseInt(values[index])
                    })
                } else {
                    filteredProviders = currentProviders.filter(provider => {
                        return provider.hasOwnProperty(key) && parseInt(provider[key]) <= parseInt(values[index])
                    })
                }
                break;
        }
        index++;
        currentProviders = filteredProviders;
    }
    return filteredProviders;
}

export const getMatchingAttributesByProviderCodeAndJobId = (jobId) => {
    var url = `${providerBaseURL}/config/${jobId}`;

    var options = {
        method: 'GET',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        uri: url,
        json: true // Automatically stringifies the body to JSON
    };

    return new Promise(function(resolve, reject) {
        rp(options)
            .then(function(attributes) {
                resolve(attributes);
            })
            .catch(function(err) {
                console.error(err);
                reject(err);
            });
    });
}

export const getProvidersByPostCodeAndJobId = async(country, jobId) => {
    var url = `${providerBaseURL}/search`;

    var payload = {
        "country": country,
        "jobId": jobId
    };

    var options = {
        method: 'POST',
        uri: url,
        body: payload,
        json: true // Automatically stringifies the body to JSON
    };

    return new Promise(function(resolve, reject) {
        rp(options)
            .then(function(providers) {
                resolve(providers);
            })
            .catch(function(err) {
                console.error(err);
                reject(err);
            });
    });
}

// Save the booking request into crowdDb
export const createBooking = async(booking) => {
    return new Promise(function(resolve, reject) {
        let newBooking = new Booking(booking)
        newBooking.save()
            .then(booking => {
                resolve(booking)
            })
            .catch(err => {
                reject(err);
            });
    });
}