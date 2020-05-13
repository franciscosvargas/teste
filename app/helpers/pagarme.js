const pagarme = require('pagarme')

const key = require('../config/key').pagarme.production

const pagarmeApi = {
    connect: pagarme.client.connect({ api_key: key })
}

module.exports = ({
    card: data => pagarmeApi.connect.then(client =>
        client.cards.create(data)
            .then(response => response)
            .catch(err => err)),

    bank: data => pagarmeApi.connect.then(client =>
        client.bankAccounts.create(data)
            .then(response => response)
            .catch(err => err)),

    ticket: data => pagarmeApi.connect.then(client =>
        client.transactions.create(data)
            .then(response => response)
            .catch(err => err)),

    calculateSignature: (header, data) => pagarme.postback.calculateSignature(header, data),

    reversalTransaction: data => pagarmeApi.connect.then(client =>
        client.transactions.refund(data)
            .then(response => response)
            .catch(err => err)),

    getTransaction: data => pagarmeApi.connect.then(client =>
        client.transactions.find({id: data})
            .then(response => response)
            .catch(err => err)),

    verifySignature: (header, data, hash) => pagarme.postback.verifySignature(header, data, hash),

    cardCredit: data => pagarmeApi.connect.then(client =>
        client.transactions.create(data)
            .then(response => response)
            .catch(err => err))

})
