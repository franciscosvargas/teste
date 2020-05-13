const mongoose = require('mongoose')
const Schema = mongoose.Schema

const searchDriver = new Schema({
    driver1: {
        type: Number
    },
    driver2: {
        type: Number
    },
    driver3: {
        type: Number
    },
    resend: {
        type: Boolean,
        default: false
    },
    blackList: [],
    locate: {
        type: [Number],
        index: '2d'
    },
    running_id: {
        type: Number
    },
    running_taxi_id: {
        type: Number
    },
    expired: {
        type: Date,
        default: require('../../helpers/dateFormat').utc(new Date())
    }
}, {
    timestamp: true
})

module.exports = mongoose.model('SearchDriverDelivery', searchDriver)