module.exports = app => {
    const Driver = app.datasource.models.Driver
    const RunnnigTaxi = app.datasource.models.RunningTaxiDriver
    const RequestTaxiDriver = app.datasource.models.RequestTaxiDriver
    const ExtractDaily = app.datasource.models.ExtractDaily
    const moment = require('moment')
    const LastLocation = app.datasource.models.LastLocation
    const { Op, fn, literal, and } = require('sequelize')
    const Errors = require('../../errors/runningDelivery/pt-br')
    return {
        accept: async (req, res, next) => {
            try {
                req.assert('driver_id', Errors.driver).notEmpty()
                const error = req.validationErrors()
                if (error) {
                    res.status(400).json(error)
                } else {
                    if (isNaN(req.params.id)) {
                        res.status(400).json([Errors.idInvalid])
                    } else {
                        const driver = await Driver.findById(req.body.driver_id)
                        if (driver) {
                            req.body.driver = driver.dataValues
                            const diary = await ExtractDaily.findOne({
                                where: {
                                    $and: [
                                        ExtractDaily.sequelize.where(
                                            ExtractDaily.sequelize.fn('DATE', ExtractDaily.sequelize.col('created_at')),
                                            ExtractDaily.sequelize.literal('CURRENT_DATE')
                                        ),
                                        { driver_id: req.body.driver_id },
                                        { service_id: driver.dataValues.service_id }
                                    ]
                                }
                            })
                            diary ? req.body.diary = true : req.body.diary = false
                            next()
                        } else {
                            res.status(400).json([Errors.driver])
                        }
                    }
                }
            } catch (err) {
                res.status(500).json(err)
            }
        },
        isCancelRunning: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { status: [3, 4] },
                        { driver_id: req.body.driver_id }
                    ]
                }
            }
            RunnnigTaxi.findOne(query)
                .then(running => running ? next() : res.status(400).json([{ title: 'Corrida', message: 'Você não pode rejeitar uma corrida em andamento!' }]))
                .catch(err => res.status(500).json(err))
        },
        isRunningOpen: (req, res, next) => {
            const query = {
                where: {
                    status: 9
                }
            }
            RunnnigTaxi.findOne(query)
                .then(running => running ? next() : res.status(400).json([{ title: 'Corrida', message: 'Corrida cancelada pelo o cliente!' }]))
                .catch(err => res.status(500).json(err))
        },
        isRunningOpenDriver: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { status: [4, 5] },
                        { driver_id: req.body.driver_id }
                    ]
                }
            }
            RunnnigTaxi.findOne(query)
                .then(running => running ? next() : res.status(400).json([{ title: 'Corrida', message: 'Você possui uma corrida em aberto!' }]))
                .catch(err => res.status(500).json(err))
        },

        isFinishReturn: async (req, res, next) => {
            const running = await RunnnigTaxi.findOne({
                where: {
                    $and: [
                        { status: [6, 10] },
                        { id: req.params.id },
                        { driver_id: req.body.driver_id }
                    ]
                },
                raw: true
            })
            if (running) {
                res.status(200).json({
                    title: 'Finalizar',
                    message: 'Finalizado com Sucesso!',
                    original_value: running.value,
                    new_value: running.value,
                    start_time: moment(running.created_at).format('YYYY-MM-DD HH:MM:SS'),
                    end_time: moment(running.finishDate).format('YYYY-MM-DD HH:MM:SS')
                })
            } else { next() }
        },
        isFinish: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        { status: 5 },
                        { driver_id: req.body.driver_id }
                    ]
                }
            }
            RunnnigTaxi.findOne(query)
                .then(running => running ? next() : res.status(400).json([{ title: 'Corrida', message: 'Você possui uma corrida em aberto!' }]))
                .catch(err => res.status(500).json(err))
        },
        active: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        { status: { $between: [2, 5] } }
                    ]
                }
            }
            RunnnigTaxi.findOne(query)
                .then(running => running ? next() : res.status(400).json({ title: 'Corrida', message: 'Corrida inexistente!' }))
                .catch(err => res.status(500).json(err))
        },
        isLatLngUpdate: async (req, res, next) => {
            try {
                if (req.body.lat && req.body.long) {
                    const location = { type: 'Point', coordinates: [req.body.lat, req.body.long] }
                    const driver = await Driver.update({ location: location }, { where: { id: parseInt(req.body.driver_id) } })
                    console.log(driver)
                    next()
                } else {
                    next()
                }
            } catch (err) {
                res.status(500).json(err)
            }
        },
        isAddressMysql: async (req, res, next) => {
            try {
                const query = {
                    where: {
                        $and: [
                            { id: req.params.id },
                            { status: 4 }
                        ]
                    },
                    include: [{ model: RequestTaxiDriver }]
                }
                const running = await RunnnigTaxi.findOne(query)
                const lat = running.dataValues.RequestTaxiDrivers[0].pointInit.coordinates[0]
                const lng = running.dataValues.RequestTaxiDrivers[0].pointInit.coordinates[1]
                const location = literal(`ST_GeomFromText('POINT(${lat} ${lng})')`)
                const distance = fn('ST_Distance_Sphere', literal('location'), location)
                const driver = await Driver.findOne({
                    raw: true,
                    where: and(
                        Driver.sequelize.where(distance, { [Op.lte]: 200 }),
                        { id: req.body.driver_id }
                    )
                })
                driver ? next() : res.status(400).json([Errors.driverNotCompany])
            } catch (err) {
                res.status(500).json(err)
            }
        },
        isAddress: async (req, res, next) => {
            try {
                const query = {
                    where: {
                        $and: [
                            { id: req.params.id },
                            { status: 4 }
                        ]
                    },
                    include: [{ model: RequestTaxiDriver }]
                }
                const running = await RunnnigTaxi.findOne(query)
                const last = await LastLocation.findOne({
                    $and: [{
                        locate: {
                            $near: {
                                $geometry: {
                                    type: 'Point',
                                    coordinates: [running.dataValues.RequestTaxiDrivers[0].pointInit.coordinates[1], running.dataValues.RequestTaxiDrivers[0].pointInit.coordinates[0]]
                                },
                                $maxDistance: 250
                            }
                        }
                    }, {
                        driver_id: req.body.driver_id
                    }]
                })
                last ? next() : res.status(400).json([Errors.driverNotCompany])
            } catch (err) {
                console.log('estou aqui', err)
                res.status(500).json(err)
            }
        },

        isCancel: (req, res, next) => next(),
        isAccept: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        // { driver_id: { $eq: null } },
                        { driver_id: req.body.driver_id },
                        { status: { $ne: 9 } }
                    ]
                }
            }
            RunnnigTaxi.findOne(query)
                .then(running => running ? next() : res.status(400).json([{ title: 'Erro', message: 'Corrida já aceita por outro Prestador!' }]))
                .catch(err => console.log('accept', err))
        },
        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json(Errors.idInvalid) : next(),

        listOneStatus: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        listOneUserStatus: (req, res, next) => isNaN(req.params.user_id) && isNaN(req.params.status) ? res.status(400).json([Errors.idInvalid]) : next(),

        listRuningUser: (req, res, next) => isNaN(req.params.user_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        statusService: (req, res, next) => isNaN(req.params.service_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        extractDriver: (req, res, next) => isNaN(req.params.driver_id) && isNaN(req.params.status) && isNaN(req.params.lastDay) ? res.status(400).json([Errors.idInvalid]) : next(),

        listRuningUserLastday: (req, res, next) => isNaN(req.params.user) && isNaN(req.params.status) && isNaN(req.params.lastDay) ? res.status(400).json([Errors.idInvalid]) : next()
    }
}
