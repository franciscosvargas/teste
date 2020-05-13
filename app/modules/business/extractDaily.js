module.exports = app => {
    const moment = require('moment-timezone').tz.setDefault('America/Recife')
    
    const ExtractDaily = app.datasource.models.ExtractDaily
    const Rates = app.datasource.models.Rates

    const isExist = (object, resolve, reject) => object ? resolve(object) : reject({title: 'Error', message: 'Não Existe!'})

    return {
        dailyValidate: (object) => {
            const query = {
                where: {
                    $and: [{
                        date: moment().format('YYYY-MM-DD')
                    }, {
                        service_id: object.service_id
                    }]
                },
                raw: true
            }
            return new Promise((resolve, reject) => {
                ExtractDaily.findOne(query)
                    .then(object => isExist(object, resolve, reject))
                    .catch(reject)
            })
        },
        dailyValue: (object) => {
            return new Promise((resolve, reject) => {
                const query = {
                    where: {service_id: object.service_id},
                    raw: true
                }
                Rates.findOne(query)
                    .then(object => isExist(object, resolve, reject))
                    .catch(reject)
            })
        }
    }
}
