// const Keys = require('../config/key')
// var client = require('twilio')(Keys.twillo.account, Keys.twillo.token)

// function send(object) {
//     client.messages.create({
//         from: '+12138949575',
//         to: `${object.phone}`,
//         body: `Seu código de ativação do IUVO Club-${object.active}`
//     })
//         .then((message) => { })
//         .catch(err => { })
// }

// module.exports = {
//     send: send
// }

// params: Message, MessageStructure, PhoneNumber ex:(+5541996470148)

const AWS = require('aws-sdk')
const path = require('path')
const config = path.join(__dirname, '../config/aws-config.json')

AWS.config.loadFromPath(config)
AWS.config.region = 'us-east-1'

module.exports.send = async (object) => {
    const sns = new AWS.SNS()
    const sendSms = {
        Message: `Seu código de ativação do IUVO Club-${object.active}`,
        PhoneNumber: `${object.phone}`,
        Subject: 'Codigo de Validacao'
    }
    sns.publish(sendSms, (error, data) => {
        if (error) {
            console.log(error, error.stack)
        } else {
            console.log(data)
        }
    })
}

