module.exports = app => {
    const ExtractDaily = app.datasource.models.ExtractDaily
    const sequelize = require('sequelize')
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')
    return {
        calculateListExtract: body => object => new Promise((resolve, reject) => {
            let initDate = moment(body.init).utcOffset(0).set({hour: 0, minute: 0, second: 0, millisecond: 1}).toISOString()
            let finishDate = moment(body.finish).utcOffset(0).set({hour: 23, minute: 59, second: 59, millisecond: 59}).toISOString()
            const query = {
                where: {
                    created_at: {$between: [initDate, finishDate]},
                    driver_id: object.query
                },
                raw: true,
                attributes: [
                    [sequelize.fn('sum', sequelize.col('value')), 'amountValueDriver'], 'driver_id'
                ],
                group: ['ExtractDaily.driver_id']
            }
            ExtractDaily.findAll(query)
                .then(extract => resolve(Object.assign({running: object.running, extract: extract, query: object.query}, {})))
                .catch(reject)
        }),
        tratmentObject: object => new Promise((resolve, reject) => {
            try {
                // console.log('estou aqui', object[0].dataValues.RunningDelivery.dataValues.Driver.dataValues)
                let response = object.map(object => object.RunningDelivery.dataValues.Driver.dataValues.id)
                resolve(Object.assign({query: response, running: object}, {}))
            } catch (err) {
                reject({
                    title: 'Error',
                    message: 'Error em tratar os dados para consulta'
                })
            }
        }),
        tratmentRunningExtract: object => new Promise((resolve, reject) => {
            try {
                object.extract.map((extract, index) => {
                    if (extract.driver_id === object.query[index]) object.running[index].dataValues.extract = extract
                })
                resolve(object)
            } catch (err) {
                console.log(err)
                reject({
                    title: 'Error',
                    message: 'Error em tratar os dados para consulta'
                })
            }
        })
    }
}
