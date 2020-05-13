const Onesignal = require('../config/key').oneSignal
const axios = require('axios')

const message = (object, appId) => ({
    app_id: appId,
    contents: object.message,
    priority: 10,
    include_player_ids: object.playerId,
    data: object.running,
    android_accent_color: 'FFFF0000'
})

const options = object => ({
    url: `${Onesignal.urls.base}${Onesignal.urls.notification.url}`,
    method: Onesignal.urls.notification.method,
    headers: Onesignal.header,
    data: object
})

const composer = (options, message) => options(message)

const requestOnesignal = request => axios(request)

module.exports = ({
    pushNotification: (object) => requestOnesignal(composer(options, message(object, Onesignal.appId)))
})
