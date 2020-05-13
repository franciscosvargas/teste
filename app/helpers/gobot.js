const mediaRootPath = require('../config/urls').mediaRootPath

const fs = require('fs')
const http = require('http')
const https = require('https')

const API_URL = 'http://whatsmailing.com.br:5000/'

const validateResponse = (resolve, reject) => (err, response, body) => err ? reject(err) : body ? resolve(body) : reject(err)
const querystring = require('querystring')

const status = (token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'status',
        method: 'GET',
        headers: {'token': token}
    }, validateResponse(resolve, reject))
})

const qrCode = (token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'qr_code',
        method: 'GET',
        headers: {'token': token}
    }, validateResponse(resolve, reject))
})

const logout = (object, token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'logout',
        method: 'GET',
        headers: {'token': token}
    }, validateResponse(resolve, reject))
})

const reboot = (object, token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'reboot',
        method: 'GET',
        headers: {'token': token}
    }, validateResponse(resolve, reject))
})

const getSettings = (object, token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'settings',
        method: 'GET',
        headers: {'token': token}
    }, validateResponse(resolve, reject))
})

const sendMessage = (object, token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'send_message',
        method: 'POST',
        headers: {'token': token, 'Content-Type': 'application/x-www-form-urlencoded'},
        body: querystring.stringify({'phone': object.phone, 'chatId': object.chat_id ? object.chat_id : '', 'body': object.body})
    }, validateResponse(resolve, reject))
})

const sendFile = (object, token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'send_file',
        method: 'POST',
        headers: {'token': token, 'Content-Type': 'application/x-www-form-urlencoded'},
        body: querystring.stringify({
            'phone': object.phone,
            'chatId': object.chat_id,
            'body': object.body,
            'filename': object.filename,
            'caption': object.caption
        })
    }, validateResponse(resolve, reject))
})

const sendPtt = (object, token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'send_ptt',
        method: 'POST',
        headers: {'token': token, 'Content-Type': 'application/x-www-form-urlencoded'},
        body: querystring.stringify({
            'phone': object.phone,
            'chatId': object.chat_id,
            'body': object.body,
            'filename': object.filename
        })
    }, validateResponse(resolve, reject))
})

const sendLink = (object, token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'send_link',
        method: 'POST',
        headers: {'token': token, 'Content-Type': 'application/x-www-form-urlencoded'},
        body: querystring.stringify({
            'phone': object.phone,
            'chatId': object.chat_id,
            'body': object.body,
            'previewBase64': object.preview_base_64,
            'title': object.title,
            'description': object.description
        }),
    }, validateResponse(resolve, reject))
})

const sendContact = (object, token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'send_contact',
        method: 'POST',
        headers: {'token': token, 'Content-Type': 'application/x-www-form-urlencoded'},
        body: querystring.stringify({'phone': object.phone, 'chatId': object.chat_id, 'contactId': object.body})
    }, validateResponse(resolve, reject))
})

// Others
const saveContactPicture = (contact) => new Promise((resolve, reject) => {
    // console.log(contact)

    // { formattedName: 'Eduardo Marciel',
    //     id:
    //     { _serialized: '555192933879@c.us',
    //         server: 'c.us',
    //         user: '555192933879' },
    //     isBusiness: false,
    //         isEnterprise: false,
    //     isHighLevelVerified: null,
    //     isMe: false,
    //     isMyContact: true,
    //     isPSA: false,
    //     isUser: true,
    //     isVerified: null,
    //     isWAContact: true,
    //     labels: [],
    //     msgs: null,
    //     name: 'Eduardo Marciel',
    //     profilePicThumbObj:
    //     { eurl: 'https://pps.whatsapp.net/v/t61.24694-24/56106079_429477697808894_9141097076396916736_n.jpg?oe=5E1B2C89&oh=b2ca7584116cb4ebcf844134268b1a79',
    //         id:
    //         { _serialized: '555192933879@c.us',
    //             server: 'c.us',
    //             user: '555192933879' },
    //         img: 'https://web.whatsapp.com/pp?t=s&u=555192933879%40c.us&i=1550267736',
    //             imgFull: 'https://web.whatsapp.com/pp?t=l&u=555192933879%40c.us&i=1550267736',
    //         raw: null,
    //         tag: '1550267736' },
    //     pushname: 'Eduardo',
    //         sectionHeader: null,
    //     shortName: 'Eduardo',
    //     statusMute: false,
    //     type: 'in',
    //     verifiedLevel: null,
    //     verifiedName: null }

    //
    const path = 'pictures/'
    if (!fs.existsSync(mediaRootPath + path)) {
        fs.mkdirSync(mediaRootPath + path)
    }

    const file = fs.createWriteStream(mediaRootPath + path + contact.id.user)
    https.get(contact.profilePicThumbObj.eurl, function (response) {
        response.pipe(file)
    })
})

const replyMessage = (object, token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'reply_message',
        method: 'POST',
        headers: {'token': token, 'Content-Type': 'application/x-www-form-urlencoded'},
        body: querystring.stringify({'message_id': object.message_id, 'message': object.message})
    }, validateResponse(resolve, reject))
})

const forwardMessage = (object, token, validateResponse) => new Promise((resolve, reject) => {
    const request = require('request')
    request({
        url: API_URL + 'forward_message',
        method: 'POST',
        headers: {'token': token, 'Content-Type': 'application/x-www-form-urlencoded'},
        body: querystring.stringify({'message_id': object.message_id, 'contact_id': object.contact_id})
    }, validateResponse(resolve, reject))
})

// const sendLocation = (object, validateResponse) => new Promise((resolve, reject) => {
//     const request = require('request')
//     request({
//         url: API_URL + 'send_location',
//         method: 'POST',
//         headers: {'token': token, 'Content-Type': 'application/x-www-form-urlencoded'},
//         body: querystring.stringify({
//             'phone': object.phone,
//             'chatId': object.chat_id,
//             'lat': object.body.latitude,
//             'lng': object.body.longitude,
//             'address': object.body.address
//         })
//     }, validateResponse(resolve, reject))
// })

module.exports = {
    validateResponse,
    status,
    qrCode,
    logout,
    reboot,
    getSettings,
    sendMessage,
    sendFile,
    sendPtt,
    sendLink,
    sendContact,
    saveContactPicture,
    replyMessage,
    forwardMessage
    // sendLocation
}
