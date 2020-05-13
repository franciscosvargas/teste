module.exports = app => {
    const Help = require('../../helpers/googleMaps')
    return {
        searchGoogle: (object) => {
            Help.calculatePointAddress(object)
        }
    }
}
