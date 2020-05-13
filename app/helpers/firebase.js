const validateResponse = (resolve, reject) =>
    (err, response, body) => err ? reject(err) : body ? resolve(body) : reject(err)

const pushNotification = (object, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    const key = require('../config/key').firebase.key
    const options = {
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type': ' application/json',
            'Authorization': `key=${key}`
        },
        body: JSON.stringify({
            data: object.data,
            notification: {title: object.title},
            to: object.token
        })
    }
    request(options, validateResponse(resolve, reject))
})

module.exports = {
    validateResponse,
    pushNotification
}
