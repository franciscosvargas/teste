
module.exports = app => {
    const ExtractDaily = app.datasource.models.ExtractDaily
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const Driver = app.datasource.models.Driver
    const User = app.datasource.models.User

    const Persistence = require('../../helpers/persistence')(ExtractDaily)

    const ExtractDailyParseFloat = object => object.map(daily => ({
        date: daily.date,
        value: parseFloat(daily.value).toFixed(2)
    }))

    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')

    return {
        create: (req, res) => {
            req.body.url = req.file.filename
            Persistence.create(req.body, res)
        },
        update: (req, res) => {
            const query = req.params
            Persistence.update(query, req.body, res)
        },
        listOne: (req, res) => {
            const query = req.params
            Persistence.listOneWithJoin(query, res)
        },
        listAll: (req, res) => {
            Persistence.listAllWithJoin(res)
        },
        extractDayDelivery: (req, res) => {
            let initDate = moment(req.params.time).utcOffset(0).set({hour: 0, minute: 0, second: 0, millisecond: 1}).toISOString()
            let finishDate = moment(req.params.time).utcOffset(0).set({hour: 23, minute: 59, second: 59, millisecond: 59}).toISOString()
            RunningDelivery.sum('value', {
                where: {
                    $and: [
                        {driver_id: req.params.driver_id},
                        {status: {$or: [6, 10]}},
                        {service_id: req.params.service_id},
                        {created_at: {$between: [initDate, finishDate]}}
                    ]
                }
            })
                .then(running => res.status(200).json([{earnings_day: running}]))
                .catch(err => res.status(500).json(err))
        },
        extractDayTaxi: (req, res) => {
            let initDate = moment(req.params.time).utcOffset(0).set({hour: 0, minute: 0, second: 0, millisecond: 1}).toISOString()
            let finishDate = moment(req.params.time).utcOffset(0).set({hour: 23, minute: 59, second: 59, millisecond: 59}).toISOString()
            RunningTaxiDriver.sum('value', {
                where: {
                    $and: [
                        {driver_id: req.params.driver_id},
                        {status: {$or: [6, 10]}},
                        {service_id: req.params.service_id},
                        {created_at: {$between: [initDate, finishDate]}}
                    ]
                }
            })
                .then(running => res.status(200).json([{earnings_day: running}]))
                .catch(err => res.status(500).json(err))
        },
        extractDayDriverDelivery: (req, res) => {
            RunningDelivery.sum('value', {
                where: {
                    $and: [
                        {driver_id: req.params.driver_id},
                        {status: {$or: [6, 10]}},
                        {service_id: req.params.service_id}
                    ]
                }
            }, {limit: 150})
                .then(running => res.status(200).json([{earnings_day: running}]))
                .catch(err => res.status(500).json(err))
        },
        paymentBetween: (req, res) => {
            let initDate = moment(req.body.init).utcOffset(0).set({hour: 0, minute: 0, second: 0, millisecond: 1}).toISOString()
            let finishDate = moment(req.body.finish).utcOffset(0).set({hour: 23, minute: 59, second: 59, millisecond: 59}).toISOString()
            ExtractDaily.findAll({
                where: {
                    $and: [
                        {driver_id: req.body.driver_id},
                        {created_at: {$between: [initDate, finishDate]}}
                    ]
                },
                attributes: ['date', 'value']
            })
                .then(extract => res.status(200).json(ExtractDailyParseFloat(extract)))
                .catch(err => res.status(500).json(err))
        },
        extractDayDriverTaxi: (req, res) => {
            RunningTaxiDriver.sum('value', {
                where: {
                    $and: [
                        {driver_id: req.params.driver_id},
                        {status: {$or: [6, 10]}},
                        {service_id: req.params.service_id}
                    ]
                }
            }, {limit: 150})
                .then(running => res.status(200).json([{earnings_day: running}]))
                .catch(err => res.status(500).json(err))
        }
    }
}
