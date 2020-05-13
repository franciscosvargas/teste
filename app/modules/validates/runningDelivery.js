module.exports = app => {
    const Errors = require('../../errors/runningDelivery/pt-br')
    const Driver = app.datasource.models.Driver
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RunningTaxi = app.datasource.models.RunningTaxiDriver
    const RequestDelivery = app.datasource.models.RequestDelivery

    const ExtractDaily = app.datasource.models.ExtractDaily
    const LastLocation = app.datasource.models.LastLocation
    const moment = require('moment')
    return {
        listRuningCompany: (req, res, next) => isNaN(req.params.company_id) && isNaN(req.params.status) ? res.status(400).json([Errors.idInvalid]) : next(),

        listRuningCompanyNotStatus: (req, res, next) => isNaN(req.params.company_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        listOneStatus: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        accept: async (req, res, next) => {
            try {
                const date = moment().format('YYYY-MM-DD')
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
                                        { service_id: driver.dataValues.service_id },
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
                console.log(err)
                res.status(500).json(err)
            }
        },
        isRunningDriver: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        { status: { $in: [4, 5] } },
                        { driver_id: req.body.driver_id }
                    ]
                }
            }
            RunningDelivery.findOne(query)
                .then(running => !running ? next() : res.status(400).json({ title: 'Corrida', message: 'Você possui uma corrida em aberto!' }))
                .catch(err => res.status(500).json(err))
        },
        isRunningOpenDriverDelivery: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { status: { $in: [4, 5] } },
                        { driver_id: req.body.driver_id }
                    ]
                }
            }
            RunningDelivery.findOne(query)
                .then(running => !running ? next() : res.status(400).json([{ title: 'Corrida', message: 'Você possui uma corrida em aberto!' }]))
                .catch(err => res.status(500).json(err))
        },
        isRunningOpenDriverTaxi: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { status: [4, 5] },
                        { driver_id: req.body.driver_id }
                    ]
                }
            }
            RunningTaxi.findOne(query)
                .then(running => !running ? next() : res.status(400).json([{ title: 'Corrida', message: 'Você possui uma corrida em aberto!' }]))
                .catch(err => res.status(500).json(err))
        },
        isProgress: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { status: 4 },
                        { id: req.params.id },
                        { driver_id: req.body.driver_id },
                        { free: true }
                    ]
                }
            }
            RunningDelivery.findOne(query)
                .then(running => running ? next() : res.status(400).json([{ title: 'Liberar Corrida', message: 'Por favor, dirija-se à origem, recolha o produto e solicite a liberação da corrida!' }]))
                .catch(err => res.status(500).json(err))
        },
        active: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        { status: { $ne: 9 } }
                    ]
                },
                raw: true
            }
            RunningDelivery.findOne(query)
                .then(running => running ? next() : res.status(400).json({ title: 'Corrida', message: 'Corrida inexistente!' }))
                .catch(err => res.status(500).json(err))
        },

        isPossible: (req, res, next) =>
            RunningDelivery.findOne({
                where: {
                    $and: [
                        { id: req.params.id },
                        { status: { $lte: 4 } }
                    ]
                }
            })
                .then(running => running ? next() : res.status(400).json({ title: 'Corrida', message: 'Corrida inexistente!' }))
                .catch(err => res.status(500).json(err)),

        isFree: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        { status: 5 },
                        { freeDriver: false }
                    ]
                }
            }
            RunningDelivery.findOne(query)
                .then(running => running ? next() : res.status(400).json([{ title: 'Corrida', message: 'Corrida inexistente!' }]))
                .catch(err => res.status(500).json(err))
        },

        isTime: (req, res, next) => {
            const utc = - 60 * 5 * 1000
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        { driver_id: req.body.driver_id },
                        { progressTime: { $lt: utc } },
                        { status: 5 }
                    ]
                },
                raw: true
            }

            RunningDelivery.findOne(query)
                .then(running => running ? next() : res.status(400).json(Errors.loadingCurrent))
                .catch(err => res.status(500).json(err))
        },
        isReturn: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        { driver_id: req.body.driver_id },
                        { status: 5 },
                        { freeDriver: true }
                    ]
                },
                include: [{ model: RequestDelivery }],
                raw: true
            }
            RunningDelivery.findOne(query)
                .then(running => !running ? next() : res.status(400).json([Errors.returnPlace])
                ).catch(err => console.log(err))
        },
        isAddress: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        { status: 4 }
                    ]
                },
                include: [{ model: RequestDelivery }]
            }
            RunningDelivery.findOne(query)
                .then(running => {
                    LastLocation.findOne({
                        $and: [{
                            locate: {
                                $near: {
                                    $geometry: {
                                        type: 'Point',
                                        coordinates: [running.dataValues.RequestDeliveries[0].pointInit.coordinates[1], running.dataValues.RequestDeliveries[0].pointInit.coordinates[0]]
                                    },
                                    $maxDistance: 250
                                }
                            }
                        }, {
                            driver_id: req.body.driver_id
                        }]
                    })
                        .then(last => last ? next() : res.status(400).json([Errors.driverNotCompany]))
                        .catch(err => res.status(500).json(err))
                })
                .catch(err => res.status(500).json(err))
        },
        isAccept: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        { driver_id: { $eq: null } },
                        { status: [2, 3] }
                    ]
                },
                raw: true
            }
            RunningDelivery.findOne(query)
                .then(running => running ? next() : res.status(400).json([{ title: 'Erro', message: 'Corrida já aceita por outro Prestador!' }]))
                .catch(err => res.status(500).json(err))
        },
        isPossibleCancel: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        { id: req.params.id },
                        { driver_id: req.body.driver_id },
                        { status: 5 }
                    ]
                },
                raw: true
            }
            RunningDelivery.findOne(query)
                .then(running => !running ? next() : res.status(400).json([{ title: 'Erro no Cancelamento', message: 'Não é possível cancelar uma corrida já iniciada!' }]))
                .catch(err => res.status(500).json(err))
        },
        extractDriver: (req, res, next) => isNaN(req.params.driver_id) && isNaN(req.params.status) && isNaN(req.params.lastDay) ? res.status(400).json([Errors.idInvalid]) : next(),

        listRuningCompanyLastday: (req, res, next) => isNaN(req.params.company_id) && isNaN(req.params.status) && isNaN(req.params.lastDay) ? res.status(400).json([Errors.idInvalid]) : next(),

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        findByDriver: (req, res, next) => isNaN(req.params.driver_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        statusService: (req, res, next) => isNaN(req.params.service_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        companyIsId: (req, res, next) => isNaN(req.params.company_id) ? res.status(400).json([Errors.idInvalid]) : next()

    }
}
