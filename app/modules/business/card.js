module.exports = app => {
    const Pagarme = require('../../helpers/pagarme')
    const Help = require('../../helpers/tratmentPagarme')
    const Cielo = require('../../helpers/cielo')
    const cardValidator = require('card-validator')

    return {
        create: (object) => {
            const objectPagarme = Help.card(object)
            return Pagarme.card(objectPagarme).then(Help.returnPagarme)
        },

        createCielo: async body => {
            try {
                const validateCard = cardValidator.number(body.cardNumber)
                let type
                if (validateCard.card) {
                    type = validateCard.card.type
                }
                console.log('type', type)
                const cielo = await Cielo.addCard({
                    CustomerName: body.cardHolderName,
                    CardNumber: body.cardNumber,
                    Holder: body.cardHolderName,
                    ExpirationDate: `${body.cardExpirationDate.substring(0, 2)}/20${body.cardExpirationDate.substring(2, 4)}`,
                    Brand: type
                })
                console.log('estou aqui', cielo)
                if (cielo.length > 0) {
                    return Promise.reject(cielo)
                }
                body.cardId = cielo.CardToken
                body.brand = type
                body.firstDigits = body.cardNumber.substring(0, 4)
                body.lastDigits = body.cardNumber.substring(body.cardNumber.length - 2, 10)
                body.expirationDate = `${body.cardExpirationDate.substring(0,2)}/20${body.cardExpirationDate.substring(2,4)}`
                body.cardCvv = body.cardCvv
                return Promise.resolve(body)
            } catch (err) {
                console.log('estou no error:', err)
                return Promise.reject(err)
            }
        }
    }
}
