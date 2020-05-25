const maps = require('@google/maps')
const googleKey = require('../config/key').googleKey

const Regex = require('../helpers/regex')

let googleMapsClient = maps.createClient({
    key: googleKey
})

const calculateSurplus = object => (object.distance_in_meters / 1000) - parseFloat(object.range_min)

const calculateValueTotal = (object, surplus) => (surplus > 0) ? (parseFloat(object.tax_per_km) * surplus) + parseFloat(object.tax_min) : parseFloat(object.tax_min)

const compared = (totalKm, franchiseMeters) => (totalKm - franchiseMeters) > 0

const requestReturn = object => object.requestReturn ? parseFloat(parseFloat(object.valueTotal) * (parseFloat(object.requestReturnValue))) : parseFloat(object.valueTotal)
const estimateAwait = object => object.estimateAwait ? parseFloat(object.valueTotal) + (object.time * parseFloat(object.estimateAwaitValue)) : parseFloat(object.valueTotal)

const calulateTime = (time, valueTime) => tratmentSecondsToMinuts(time) * valueTime

const calculateKm = (km, valueKm, franchiseMeters) => (km - franchiseMeters) > 0
    ? (((km - franchiseMeters) / 1000) * valueKm).toFixed(2)
    : (0 * valueKm)

const tratmentSecondsToMinuts = (time) => time / 60

const calculateBandeiraTotal = (valueTime, valueKm, bandeirada, fixedValue) => ((valueTime + valueKm + bandeirada) * fixedValue)

const whatBandeirada = (object) => object.bandeirada1 ? parseFloat(object.rates.baseValue1) : parseFloat(object.rates.baseValue2)

const getAddressLatLng = object => {
    const address = `${Regex.removeParenthesis(object.address)},${object.number},${object.city},${object.state}`
    return new Promise((resolve, reject) =>
        googleMapsClient.geocode({
            'address': address
        }, (status, result) => status ? reject(status) : resolve(result))
    )
}

const getLocationAddressLatLng = (lat, lng) => {
    const latlng = `${parseFloat(lat)},${parseFloat(lng)} `
    return new Promise((resolve, reject) =>
        googleMapsClient.reverseGeocode({
            'latlng': latlng
        }, (status, result) => status ? reject(status) : resolve(result))
    )
}

const returnCityStateCountry = object => {
    return new Promise((resolve, reject) => {
        getLocationAddressLatLng(object.lat, object.lng)
            .then(googleSearch => {
                try {
                    object.address = {
                        number: '',
                        district: '',
                        city: '',
                        state: '',
                        addressComplet: '',
                        country: '',
                        zipCode: ''
                    }
                    googleSearch.json.results[0].address_components.map((search) => {
                        if (search.types[0] === 'street_number') object.address.number = search.short_name
                        if (search.types[1] === 'sublocality') object.address.district = search.short_name
                        if (search.types[0] === 'administrative_area_level_2') object.address.city = search.short_name
                        if (search.types[0] === 'administrative_area_level_1') object.address.state = search.short_name
                        if (search.types[0] === 'postal_code') object.address.zipCode = search.short_name
                        if (search.types[0] === 'country') object.address.country = search.short_name
                    })

                    object.address.addressComplet = googleSearch.json.results[0].formatted_address
                    resolve(object)
                } catch (err) {
                    reject(err)
                }
            })
            .catch(resolve)
    })
}

const calculateRateSurplus = object => {
    try {
        return calculateValueTotal(object, calculateSurplus(object))
    } catch (err) {
        console.log(err)
    }
}

const calculatePointAddressMulti = object => {
    const query = {
        origins: object.init,
        destinations: object.finish,
        mode: 'driving'
    }

    return new Promise((resolve, reject) => {
        googleMapsClient.distanceMatrix(query, (err, result) => {
            if (err) reject(err)
            try {
                result.json.rows[0].elements.map((element, index) => {
                    object.calculate[index].duration = element.duration.text
                    object.calculate[index].durationTime = element.duration.value
                    object.calculate[index].kilometers = element.distance.text
                    object.calculate[index].meters = element.distance.value
                    object.calculate[index] = calculateRateSurplus(object.calculate[index])
                    object.calculate[index].originAddresses = result.json.destination_addresses[index]
                    object.calculate[index].destinationAddresses = result.json.origin_addresses[index]
                })
            } catch (error) {
                reject(error)
            }
            resolve(object)
        })
    })
}
const calculatePointAddress = object => {
    const query = {
        origins: [`${object.origin_address}`],
        destinations: [`${object.destination_address}`],
        mode: 'driving'
    }
    return new Promise((resolve, reject) => {
        googleMapsClient.distanceMatrix(query, (err, result) => {
            if (err) reject(err)

            const pathResult = {};
            pathResult.found = result.json.status === 'OK';

            if(pathResult.found) {
                let distanceMatrixResult = result.json.rows[0].elements[0];
                pathResult.origin_addresses = object.origin_address;
                pathResult.destination_addresses = object.destination_address;
                pathResult.found = distanceMatrixResult.status === 'OK';

                if(pathResult.found) {
                    pathResult.duration_text = distanceMatrixResult.duration.text;
                    pathResult.duration_in_seconds = distanceMatrixResult.duration.value;
                    pathResult.distance_km_text = distanceMatrixResult.distance.text;
                    pathResult.distance_in_meters = distanceMatrixResult.distance.value;
                    pathResult.value_total = calculateRateSurplus({...pathResult, ...object})
                }
            }

            if (!pathResult.found) {
                pathResult.value_total = parseFloat(object.tax_address_not_found);
            }

            console.log(JSON.stringify(pathResult, null, 4))
            resolve(pathResult)
        })
    })
}

const calculatePointAddressTaxiSum = (object) => {
    const timeTotal = parseFloat(calulateTime(object.durationTime, parseFloat(object.bandeirada1 ? object.rates.minBandeirada1 : object.rates.minBandeirada2)))
    console.log('timeTotal', timeTotal)
    console.log('meters km 1', ((object.meters / 1000) * object.rates.valueKm1))
    console.log('meters km 2', ((object.meters / 1000) * object.rates.valueKm2))
    console.log('valueKm1', object.rates.valueKm1)
    const kmTotal = object.bandeirada1
        ? parseFloat(calculateKm(object.meters, parseFloat(object.rates.valueKm1), parseFloat(object.rates.franchiseMeters)))
        : parseFloat(calculateKm(object.meters, parseFloat(object.rates.valueKm2), parseFloat(object.rates.franchiseMeters)))
    console.log('kmTotal', kmTotal)
    const bandeirada = parseFloat(whatBandeirada(object))
    console.log('bandeirada', bandeirada)
    object.valueTotal = (calculateBandeiraTotal(timeTotal, kmTotal, bandeirada, parseFloat(object.rates.fixedValue) + 1)).toFixed(2)
    console.log('valueTotal', object.valueTotal)
    return object
}

const calculatePointAddressTaxi = object => {
    const query = {
        origins: `${object.clientLat}, ${object.clientLng}`,
        destinations: `${object.destinationLat}, ${object.destinationLng}`
    }
    return new Promise((resolve, reject) => {
        googleMapsClient.distanceMatrix(query, (err, result) => {
            if (err) reject(err)
            object.duration = result.json.rows[0].elements[0].duration.text
            console.log('duration', object.duration)
            object.durationTime = result.json.rows[0].elements[0].duration.value
            console.log('durationTime', object.durationTime)
            object.kilometers = result.json.rows[0].elements[0].distance.text
            console.log('kilometers', object.kilometers)
            object.meters = result.json.rows[0].elements[0].distance.value
            console.log('meters', object.meters)
            object.originAddresses = result.json.origin_addresses
            object.destinationAddresses = result.json.destination_addresses
            object = calculatePointAddressTaxiSum(object)
            resolve(object)
        })
    })
}

module.exports = {
    getAddressLatLng,
    returnCityStateCountry,
    calculatePointAddress,
    calculatePointAddressMulti,
    calculatePointAddressTaxi,
    getLocationAddressLatLng
}
