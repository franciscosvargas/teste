const validateNumber = object => typeof object === 'number'

const toConvertFloat = object => parseFloat(object)

const validateAmountAuthorizate = (amount, authorizedAmount) => (amount === authorizedAmount)

const withdrawRate = (amount, rate) => parseInt((parseInt(amount) - (parseInt(rate * 100))) / 100)

const isDay = new Array("domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado")

const whatADay = (Date, isDay) => isDay[Date]

const whatHour = (Date) => parseInt(Date)

const moment = require('moment-timezone').tz.setDefault('America/Recife')

module.exports = app => {
    const Holidays = app.datasource.models.Holidays
    return {
        ticketBalance: (object) => {
            // const retorno = validateAmountAuthorizate(object.amount, object.authorizedAmount)
            const rate = object.TypeTransaction.rate.replace(',', '.')
            return new Promise((resolve, reject) => {
                if (validateAmountAuthorizate(object.amount, object.authorizedAmount)) {
                    object.amount = withdrawRate(object.amount, rate)
                    resolve(object)
                } else {
                    throw new Error('Not equals payment')
                }
            })
        },
        cardBalance: (object) => {
            object.amount = toConvertFloat(object.amount)
            object.authorizedAmount = toConvertFloat(object.authorizedAmount)

            return new Promise((resolve, reject) => {
                try {
                    if (validateNumber(object.amount) && validateNumber(object.authorizedAmount)) {
                        if (validateAmountAuthorizate(object.amount, object.authorizedAmount)) {
                            object.amount = parseFloat(object.transaction.dataValues.amountNotTax)
                            resolve(object)
                        } else {
                            throw new Error('Not equals payment')
                        }
                    } else {
                        throw new TypeError('Not number')
                    }
                } catch (err) {
                    reject({title: 'Error', message: 'Error tratment paid card'})
                }

            })
        },

        bandeirada: (object) => {
            const day = whatADay(moment().day(), isDay)
            const hour = whatHour(moment().hours())
            const date = moment().format('YYYY-MM-DD')
            const query = {
                where: {
                    $and: [{
                        date: date
                    }, {
                        city_id: object.city_id
                    }],
                    $or: [{
                        date: date
                    }, {
                        country_id: object.country_id
                    }]
                }
            }
            return new Promise((resolve, reject) => {
                Holidays.findOne(query)
                    .then(holidays => {
                        if (holidays || day === 'Sabádo' || day === 'domingo' || hour >= 22 || hour <= 05) {
                            object.bandeirada2 = true
                            object.bandeirada1 = false
                            resolve(object)
                        } else {
                            object.bandeirada2 = false
                            object.bandeirada1 = true
                            resolve(object)
                        }
                    })
                    .catch(reject)
            })
        }
    }
}