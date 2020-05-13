const sendGcm = (object) => new Promise((resolve, reject) => {
    try {
        const gcm = require('node-gcm')
        const key = require('../config/key').gcm
        const sender = new gcm.Sender(key.key)
        let message = new gcm.Message()
        message.addData(object.title, object.message)
        let registrationIds = [object.token]
        sender.send(message, registrationIds, (err, response) => {
            if (err) reject(err)
            resolve(response)
        })
    } catch (err) {
        reject(err)
    }
})

module.exports = {
    sendGcm
}
