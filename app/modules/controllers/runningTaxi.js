module.exports = app => {
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const Persistence = require('../../helpers/persistence')(RunningTaxiDriver)
    const Business = require('../business/runningTaxi')(app)
    const Driver = app.datasource.models.Driver
    const RequestTaxiDriver = app.datasource.models.RequestTaxiDriver
    const Service = app.datasource.models.Services
    const User = app.datasource.models.User
    const moment = require('moment-timezone')
    const HelpCielo = require('../../helpers/tratmentCielo')
    moment.tz.setDefault('America/Recife')
    return {
        testEmail: (req, res) => {
            const Template = require('../../templates/send-email-running.html')
            require('../../helpers/sendEmail')(app).send({email: 'higordiegoti@gmail.com'}, Template, 'Descrição')
            res.status(200).json({email: 'enviei'})
        },
        listOne: (req, res) => {
            Persistence.listOneNotWhere({
                where: req.params,
                include: [
                    {
                        model: RequestTaxiDriver,
                        include: {
                            model: User,
                            attributes: ['name']
                        }
                    },
                    {
                        model: Driver,
                        include: {
                            model: User,
                            attributes: ['name', 'number', 'ddd', 'ddi', 'email', 'avatar']
                        }
                    }
                ]
            }, res)
        },
        listOneUserStatus: (req, res, next) => {
            const query = {
                where: {
                    $and: [{
                        user_id: req.params.user_id
                    }, {
                        status: req.params.status
                    }]
                },
                include: {
                    all: true
                }
            }
            Persistence.findAndCountAll(query, res)
        },
        update: (req, res) => {
            const query = req.params
            const mod = req.body
            Persistence.update(query, mod, res)
        },
        listRuningUser: (req, res, next) => {
            const query = {
                where: {
                    user_id: req.params.user_id
                },
                include: {
                    all: true
                }
            }
            Persistence.findAndCountAll(query, res)
        },
        listRuningUserLastday: (req, res, next) => {
            const query = {
                where: {
                    $and: [{
                        user_id: req.params.user_id
                    }, {
                        status: req.params.status
                    }, {
                        created_at: {
                            lte: new Date((new Date()).getTime() - (86400000 * req.params.lastDay))
                        }
                    }]
                },
                include: {
                    all: true
                }
            }
            Persistence.findAndCountAll(query, res)
        },
        accept: eventEmitter => async (req, res, next) => {
            try {
                const query = {
                    where: {
                        id: parseInt(req.params.id)
                    }
                }
                const mod = {
                    status: 4,
                    driver_id: parseInt(req.body.driver_id)
                }
                const ratesLitOne = await Business.ratesListOne(req.body)
                await Business.daily(req.body)(ratesLitOne)
                // const desocupedDriverList = await Business.desocupedDriversList(req)(daily)
                await Business.ocupedDriver(req.body.driver_id)()
                // const ocupedDriverMongo = await Business.ocupedDriverMongo(req.body.driver_id)(ocupedDriver)
                const updateAcceptRunning = await Business.updateAcceptRunning(query, mod)()
                const returnRunningOne = await Business.returnRunningOne(req.params.id)(updateAcceptRunning)
                returnRunningOne.dataValues.status = 4
                // const listDeviceClient = await Business.listDeviceClient(returnRunningOne)
                // const listOneDriver = await Business.listOneDriver(req.body.driver_id)(listDeviceClient)
                // const runningPush = await Business.runningPush(req.params.id)
                // runningPush.dataValues.status = 4
                // const pushNotificationClientAccept = await Business.pushNotificationClientAccept(runningPush)(listOneDriver)
                // const logSendRunning = await Business.logSendRunning(req, 'Corrida Aceita Pelo o Motorista', listOneDriver.driver)(pushNotificationClientAccept)
                // eventEmitter.emit('running_particular', { running_id: runningPush, user_id: runningPush.dataValues.user_id, service_id: runningPush.dataValues.service_id })
                // res.status(200).json(logSendRunning.object)
                eventEmitter.emit('service-ride-confirmed', returnRunningOne.dataValues)
                res.status(200).json(returnRunningOne.dataValues)
            } catch (err) {
                res.status(400).json([err])
            }
        },
        cancelDriver: (req, res, next) =>
            Business.blackList(req)
                .then(Business.cancelMongodb(req))
                .then(Business.removeDriver(req))
                .then(Business.listOneDriver(req.body.driver_id))
                .then(Business.returnStatusRunning(req.params.id))
                .then(resp => res.status(200).json(resp))
                .catch(err => console.log(err)),

        cancelRunningDriver: eventEmitter => async (req, res) => {
            try {
                // await Business.blackList(req)
                // const cancelMongod = await Business.cancelMongodb(req)(blackList)
                // await Business.blackListDriver(req.params.id, req.body)
                // const removeDriver = await Business.removeDriver(blackList)
                await Business.updateFreeDriver(req.body)
                const returnRunning = await Business.returnRunningOne(req.params.id)()
                const listDeviceClient = await Business.listDeviceClient(returnRunning)
                returnRunning.dataValues.status = 3
                const runningPush = await Business.runningPush(req.params.id)
                runningPush.dataValues.status = 3
                const pushNotificationClientCancel = await Business.pushNotificationClientCancel(runningPush)(listDeviceClient)
                const returnStatusRunning = await Business.returnStatusRunning(req.params.id)(pushNotificationClientCancel)
                const listOneDriver = await Business.listOneDriver(returnRunning.dataValues.driver_id)()
                const logSendRunning = await Business.logSendRunning(req, 'Corrida Cancelada pelo o Motorista', listOneDriver.driver)(returnStatusRunning)
                eventEmitter.emit('running_particular', {
                    running_id: returnRunning,
                    user_id: returnRunning.dataValues.user_id,
                    service_id: returnRunning.dataValues.service_id
                })
                res.status(200).json(logSendRunning)
            } catch (err) {
                res.status(500).json(err)
            }
        },

        cancelUser: async (req, res) => {
            try {
                const searchRunning = await Business.searchRunning(req.params.id)
                const driverToken = await Business.driverToken(searchRunning)
                const pushNotificationCancel = await Business.pushNotificationCancel(req.params.id)(driverToken)
                const desocupedDriver = await Business.desocupedDriver(req.params.id)(pushNotificationCancel)
                const runningTaxiCancel = await Business.RunningTaxiCancel(req.params.id)(desocupedDriver)
                if (searchRunning.dataValues.driver_id) {
                    const listOneDriver = await Business.listOneDriver(searchRunning.dataValues.driver_id)()
                    await Business.logSendRunning(req, 'Corrida Cancelada Pelo o Usuário', listOneDriver.driver)(runningTaxiCancel)
                } else {
                    await Business.logSendRunning(req, 'Corrida Cancelada Pelo o Usuário', {})(runningTaxiCancel)
                }

                const searchRunningFinish = await Business.searchRunningFinish(req.params.id, 4)(runningTaxiCancel)
                if (parseInt(searchRunning.dataValues.typePayment) === 2) {
                    await Business.refundTransactionCielo(searchRunningFinish)
                }
                const object = await Business.refundExtracDaily(searchRunningFinish)

                // log
                const searchRunningTemp = await Business.searchRunningTemp(req.params.id)
                const listDriversSend = await Business.searchTempBlockDrivers(req.params.id)
                if (listDriversSend) listDriversSend.map(value => Business.ocupedStatusDriver(false, value))
                if (searchRunningTemp) {
                    await Business.blockTempDriverDelete(searchRunningTemp)
                    await Business.blockRunningTempDriverDelete(searchRunningTemp)
                }
                //
                res.status(200).json([object])
            } catch (err) {
                console.log(err)
                res.status(400).json(err)
            }
        },
        progress: eventEmitter => async (req, res, next) => {
            try {
                const query = {
                    id: parseInt(req.params.id)
                }
                const mod = {
                    status: 5,
                    progressTime: moment()
                }
                const returnRunningOne = await Business.returnRunningOne(req.params.id)()
                returnRunningOne.dataValues.status = 5

                // const listDeviceClient = await Business.listDeviceClient(returnRunningOne)
                // const listOneDriver = await Business.listOneDriver(req.body.driver_id)(listDeviceClient)
                // const runningPush = await Business.runningPush(req.params.id)
                // runningPush.dataValues.status = 5
                // const pushNotificationClientProgress = await Business.pushNotificationClientProgress(runningPush)(listOneDriver)
                // await Business.logSendRunning(req, 'Corrida Iniciada', listOneDriver.driver)(pushNotificationClientProgress)

                const searchRunningTemp = await Business.searchRunningTemp(req.params.id)
                const listDriversSend = await Business.searchTempBlockDrivers(req.params.id)
                if (listDriversSend) listDriversSend.map(value => Business.ocupedStatusDriver(false, value))
                if (searchRunningTemp) {
                    await Business.blockTempDriverDelete(searchRunningTemp)
                    await Business.blockRunningTempDriverDelete(searchRunningTemp)
                }
                // eventEmitter.emit('service-ride-driving', {
                //     running_id: returnRunningOne,
                //     user_id: returnRunningOne.dataValues.user_id,
                //     service_id: returnRunningOne.dataValues.service_id
                // })
                eventEmitter.emit('provider-position', {
                    driver_id: req.body.driver_id,
                    user_id: returnRunningOne.dataValues.user_id,
                    position: {lng: req.body.long, lat: req.body.lat}
                })
                // eventEmitter.emit('running_particular', { running_id: returnRunningOne, user_id: returnRunningOne.dataValues.user_id, service_id: returnRunningOne.dataValues.service_id })
                Persistence.update(query, mod, res)
            } catch (err) {
                res.status(400).json(err)
            }
        },
        finish: eventEmitter => async (req, res, next) => {
            const searchRunningFinish = await Business.searchRunningFinish(req.params.id, 5)()
            if (parseInt(searchRunningFinish.dataValues.typePayment) === 2) {
                try {
                    searchRunningFinish.dataValues.status = 6
                    const tratmentCalculate = await Business.tratmentCalculate(req.body, searchRunningFinish)
                    await Business.refundTransactionCielo(tratmentCalculate)
                    // const refundCapture = await Business.refundCapture(tratmentCalculate)
                    const ratesListOneTaxi = await Business.ratesListOneTaxi(tratmentCalculate)
                    // const isPromoCode = await Business.isPromocde(ratesListOneTaxi)
                    const rulesPercent = await Business.rulesPercent(ratesListOneTaxi)
                    const rulesIsBandeirada = await Business.isBandeirada(rulesPercent)
                    const calculateTaxiTypePayment = await Business.calculateTaxiTypePayment(rulesIsBandeirada)
                    const isPaymentType = await Business.isPaymentType(calculateTaxiTypePayment)
                    const cardOne = await Business.cardOne(isPaymentType)

                    // Business
                    // const pagarmeChange = await Business.pagarmeChange(cardOne)

                    // const pagarmeSend = await Business.pagarmeSend(pagarmeChange)
                    const cieloSend = await Business.transactionCardCielo(cardOne)
                    const returnCard = await HelpCielo.returnTransactionCard(cieloSend)

                    const createTransaction = await Business.createTransactionCielo(returnCard)

                    const objectCreate = Object.assign({transactionCard: createTransaction.dataValues}, cardOne)
                    const desocupedDriver = await Business.desocupedDriver(req.params.id)(objectCreate)
                    const status = returnCard.authorizationCode == '00' || returnCard.authorizationCode == '000' ? 6 : 12
                    const updateRunning = await Business.updateRuning(req, status, status)(desocupedDriver)
                    const desocupedDriverMysql = await Business.desocupedDriverMysql(req.body.driver_id)(updateRunning)
                    const returnObject = await Business.returnObject(desocupedDriverMysql)
                    const listDeviceClientFinish = await Business.listDeviceClientFinish(searchRunningFinish)(returnObject)
                    const listOneDriver = await Business.listOneDriver(req.body.driver_id)(listDeviceClientFinish)
                    const runningPush = await Business.runningPush(req.params.id)
                    runningPush.dataValues.status = 6
                    const pushNotificationClientFinish = await Business.pushNotificationClientFinish(runningPush)(listOneDriver)
                    const logSendRunning = await Business.logSendRunning(req, 'Corrida Finalizada', listOneDriver.driver)(pushNotificationClientFinish)
                    eventEmitter.emit('running_particular', {
                        running_id: searchRunningFinish,
                        user_id: searchRunningFinish.dataValues.user_id,
                        service_id: searchRunningFinish.dataValues.service_id
                    })
                    Business.sendEmailRunningFinish(searchRunningFinish.dataValues.id)
                    res.status(200).json([logSendRunning.object])
                } catch (err) {
                    const rowBackRunning = await Business.rowBackRunning(req, 5)
                    await Business.rowBackMongoLastLocation(req)(rowBackRunning)
                    res.status(400).json(err)
                }
            } else if (parseInt(searchRunningFinish.dataValues.typePayment) === 1) {
                try {
                    searchRunningFinish.dataValues.status = 6
                    const tratmentCalculate = await Business.tratmentCalculate(req.body, searchRunningFinish)
                    const ratesListOneTaxi = await Business.ratesListOneTaxi(tratmentCalculate)
                    const rulesPercent = await Business.rulesPercent(ratesListOneTaxi)
                    const rulesIsBandeirada = await Business.isBandeirada(rulesPercent)
                    const calculateTaxiTypePayment = await Business.calculateTaxiTypePayment(rulesIsBandeirada)
                    const isPaymentType = await Business.isPaymentType(calculateTaxiTypePayment)
                    const desocupedDriver = await Business.desocupedDriver(req.params.id)(isPaymentType)
                    const updateRunning = await Business.updateRuning(req, 6, 1)(desocupedDriver)
                    const desocupedDriverMysql = await Business.desocupedDriverMysql(req.body.driver_id)(updateRunning)
                    const returnObject = await Business.returnObject(desocupedDriverMysql)
                    const listDeviceClientFinish = await Business.listDeviceClientFinish(searchRunningFinish)(returnObject)
                    const listOneDriver = await Business.listOneDriver(req.body.driver_id)(listDeviceClientFinish)
                    const runningPush = await Business.runningPush(req.params.id)
                    runningPush.dataValues.status = 6
                    const pushNotificationClientFinish = await Business.pushNotificationClientFinish(runningPush)(listOneDriver)
                    const logSendRunning = await Business.logSendRunning(req, 'Corrida Finalizada', listOneDriver.driver)(pushNotificationClientFinish)
                    eventEmitter.emit('running_particular', {
                        running_id: searchRunningFinish,
                        user_id: searchRunningFinish.dataValues.user_id,
                        service_id: searchRunningFinish.dataValues
                    })
                    Business.sendEmailRunningFinish(searchRunningFinish.dataValues.id)
                    res.status(200).json([logSendRunning.object])
                } catch (err) {
                    const rowBackRunning = await Business.rowBackRunning(req, 5)
                    await Business.rowBackMongoLastLocation(req)(rowBackRunning)
                    res.status(400).json([{title: 'Error', message: 'Tivemos um problema, tente novamente!'}])
                }
            } else {
                res.status(400).json({title: 'Corrida', message: 'Corrida não existe!'})
            }
        },
        userHistoric: (req, res) => {
            RunningTaxiDriver.findAndCountAll({
                where: {
                    $and: [
                        {
                            user_id: req.user.object.id
                        },
                        {
                            service_id: parseInt(req.params.service_id)
                        }
                    ],
                    status: {
                        $in: req.body.status
                    }
                },
                include: [
                    {
                        model: Driver,
                        include: [
                            {
                                model: User
                            }
                        ]
                    },
                    {
                        model: Service
                    },
                    {
                        model: RequestTaxiDriver
                    }
                ],
                order: [
                    ['created_at', 'DESC']
                ]
            })
                .then(running => res.status(200).json(running))
                .catch(err => res.status(500).json(err))
        },
        extractDriver: (req, res) => {
            const query = {
                where: {
                    $and: [{
                        driver_id: req.params.driver_id
                    }, {
                        status: req.params.status
                    }, {
                        created_at: {
                            lte: new Date((new Date()).getTime() - (86400000 * req.params.lastDay))
                        }
                    }]
                },
                order: [
                    ['id', 'DESC']
                ],
                include: {
                    all: true
                }
            }
            Persistence.findAndCountAll(query, res)
        },
        confirmUserIdentity: eventEmitter => async (req, res) => {
            try {
                await Persistence.update({id: parseInt(req.params.id)}, {userIdentityConfirmed: true}, res)
                Business.verifyBothConfirmed(eventEmitter, parseInt(req.params.id))
            } catch (err) {
                res.status(400).json(err)
            }
        },
        denyUserIdentity: eventEmitter => async (req, res) => {
            try {
                await Persistence.update({id: parseInt(req.params.id)}, {userIdentityConfirmed: false}, res)
                Business.onIdentityDenied(eventEmitter, parseInt(req.params.id), 'Provider')
            } catch (err) {
                res.status(400).json(err)
            }
        },
        confirmProviderIdentity: eventEmitter => async (req, res) => {
            try {
                await Persistence.update({id: parseInt(req.params.id)}, {providerIdentityConfirmed: true}, res)
                Business.verifyBothConfirmed(eventEmitter, parseInt(req.params.id))
            } catch (err) {
                res.status(400).json(err)
            }
        },
        denyProviderIdentity: eventEmitter => async (req, res) => {
            try {
                await Persistence.update({id: parseInt(req.params.id)}, {providerIdentityConfirmed: false}, res)
                Business.onIdentityDenied(eventEmitter, parseInt(req.params.id), 'User')
            } catch (err) {
                res.status(400).json(err)
            }
        }
    }
}
