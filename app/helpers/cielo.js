const { cielo } = require('../config/key')

const util = require('util')

const axios = require('axios')

// const Cielo = require('cielo')(cielo)

const cieloRequest = async (data, params, method) => {
    try {
        const response = await axios({
            method: method,
            url: `${cielo.url}/${params}`,
            headers: {
                MerchantKey: cielo.MerchantKey,
                MerchantId: cielo.MerchantId
            },
            data: data
        })
        return Promise.resolve(response.data)
    } catch (err) {
        return Promise.reject(err.response.data)
    }
}

module.exports.addCard = (card) => cieloRequest(card, '/1/card', 'POST')

module.exports.transactionCard = (transaction) => cieloRequest(transaction, '1/sales', 'POST')

module.exports.trasnactionRefund = (transaction) => {
    const params = util.format('1/sales/%s/void?amount=%s', transaction.paymentId, transaction.amount)
    cieloRequest(transaction, params, 'PUT')
}
