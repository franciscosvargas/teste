module.exports = app => {
    const Driver = app.datasource.models.Driver
    const Service = app.datasource.models.Services
    const Vehicles = app.datasource.models.Vehicles
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver

    const Errors = require('../../errors/driver/pt-br')

    return {
        update: (req, res, next) => {
            console.log('estou aqui no update')
            req.assert('status', Errors.active).isBoolean()
            req.assert('cardDiscount', Errors.cardDiscount).notEmpty()
            req.assert('moneyDiscount', Errors.moneyDiscount).notEmpty()
            req.assert('service_id', Errors.service_id).notEmpty()
            req.assert('vehicle_id', Errors.vehicle_id).notEmpty()
            const error = req.validationErrors()
            console.log('estou no error', error)
            error ? res.status(400).json(error) : next()
        },
        listOneDriver: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next(),

        listOneDriverBody: (req, res, next) => isNaN(req.params.driver_id) ? res.json([Errors.idInvalid]) : next(),

        setStatus: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next(),

        isRunningDelivery: (req, res, next) => {
            const query = {
                where: {
                    driver_id: parseInt(req.params.id),
                    $or: [
                        {status: 4},
                        {status: 5}
                    ]
                },
                include: {all: true}
            }
            RunningDelivery.findOne(query)
                .then(running => {
                    (running)
                        ? res.status(400).json([Object.assign({error: Errors.runningInProgress, running: running}, {})])
                        : next()
                })
                .catch(err => res.status(500).json(err))
        },
        isRunningTaxi: (req, res, next) => {
            const query = {
                where: {
                    driver_id: parseInt(req.params.id),
                    $or: [
                        {status: 4},
                        {status: 5}
                    ]
                },
                include: {all: true}
            }
            RunningTaxiDriver.findOne(query)
                .then(running =>
                    (running)
                        ? res.status(400).json([Object.assign({error: Errors.runningInProgress, running: running}, {})])
                        : next()
                ).catch(err => res.status(500).json(err))
        },

        listCompany: (req, res, next) => isNaN(req.params.company_id) ? res.json([Errors.idInvalid]) : next(),

        pushNotification: (req, res, next) => {
            req.assert('token', Errors.token).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },

        unlockCompany: (req, res, next) => {
            req.assert('description', Errors.description).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },

        updatePost: (req, res, next) => {
            req.assert('driver_id', Errors.driverId).notEmpty()
            req.assert('service_id', Errors.service_id).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        historicRunning: (req, res, next) => {
            req.assert('init', Errors.init).notEmpty()
            req.assert('finish', Errors.finish).notEmpty()
            req.assert('service_id', Errors.service_id).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        active: (req, res, next) => {
            req.assert('active', Errors.active).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        setup: (req, res, next) => {
            // req.assert('bringPet', Errors.bringPet).notEmpty()
            req.assert('talkMood', Errors.talkMood).notEmpty()
            req.assert('lookUpLocation', Errors.lookUpLocation).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        activeFalse: (req, res, next) => {
            const query = {
                where: {
                    $and: [{
                        id: parseInt(req.params.id)
                    }, {
                        active: false
                    }]
                }
            }
            Driver.findOne(query)
                .then(driver => driver ? next() : res.status(400).json({title: 'Prestador', message: 'Já está ativo!'}))
                .catch(err => res.status(400).json(err))
        },
        listOne: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.userNotExist]) : next()
    }
}
