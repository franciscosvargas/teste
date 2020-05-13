module.exports = app => {
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RequestDelivery = app.datasource.models.RequestDelivery
    const Driver = app.datasource.models.Driver
    const Company = app.datasource.models.Company
    const ClientCompany = app.datasource.models.ClientCompany
    const Service = app.datasource.models.Services
    const User = app.datasource.models.User
    const Devices = app.datasource.models.Devices

    const Business = require('../business/runningDelivery')(app)
    const Persistence = require('../../helpers/persistence')(RunningDelivery)
    const FinancialTransactionBusiness = require('../business/financialTransaction')(app)

    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')

    return {
        toDay: (req, res) => {
            let initDate = moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 1 }).toISOString()
            let finishDate = moment().utcOffset(0).set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).toISOString()
            const query = {
                where: {
                    $and: [
                        { created_at: { $between: [initDate, finishDate] } },
                        { company_id: req.params.company_id }
                    ]
                },
                include: [
                    {
                        model: Company,
                        attributes: ['fantasy']
                    },
                    {
                        model: Service,
                        attributes: ['name']
                    }, {
                        model: RequestDelivery,
                        attributes: ['id']
                    }, {
                        model: Driver,
                        attributes: ['id'],
                        include: [
                            {
                                model: User,
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            }
            Persistence.listAllQuery(query, res)
        },
        listRuningCompany: (req, res) => {
            const query = {
                where: {
                    $and: [{
                        company_id: req.params.company_id
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

        listOneStatus: (req, res) => {
            const query = {
                where: {
                    $and: [{
                        status: req.params.status
                    },
                    {
                        id: req.params.id
                    },
                    {
                        user_id: req.user.object.id
                    }
                    ]
                },
                include: {
                    all: true
                }
            }
            Persistence.listAllQuery(query, res)
        },
        listRuningCompanyNotStatus: (req, res) => {
            Persistence.listAllPaginated({
                where: req.params,
                order: [
                    ['id', 'DESC']
                ],
                include: [
                    {
                        model: RequestDelivery,
                        attributes: ['id'],
                        include: {
                            model: ClientCompany,
                            attributes: ['name', 'phone']
                        }
                    },
                    {
                        model: Driver,
                        attributes: ['id'],
                        include: [{
                            model: User,
                            attributes: ['name']
                        }]
                    }
                ],
                attributes: ['value', 'driver_id', 'id', 'created_at', 'status', 'freeDriver']
            }, res)(req.query.page)
        },
        runningAssignmentOneDriver: async (req, res) => {
            try {
                const returnRunning = await Business.returnRunningOne(req.params.id)()
                const listOneDriver = await Business.listOneDriver(req.body.id)(returnRunning)
                const devices = await Business.deviceListTesst(req.body.id)(listOneDriver)
                await Business.logSendRunning(req, 'Corrida Aceita')(listOneDriver)
                const tratamentPushNotification = await Business.tratmentPushNotificationOneDriver(returnRunning)
                await Business.pushNotificationTest({ device: devices.device, tratment: tratamentPushNotification })
                res.status(200).json(tratamentPushNotification)
            } catch (err) {
                res.status(400).json(err)
            }
        },
        deviceList: id => object => new Promise((resolve, reject) => {
            Devices.findOne({ where: { driver_id: id } }, { raw: true })
                .then(devices => resolve(Object.assign({ device: devices }, object)))
                .catch(reject)
        }),
        accept: eventEmitter => async (req, res) => {
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
                const rates = await Business.ratesListOne(req.body)
                const daily = await Business.daily(req.body)(rates)
                // const desocuped = await Business.desocupedDriversList(req)(daily)
                const updateRunning = await Business.updateAcceptRunning(query, mod)(daily)
                const ocupedDriver = await Business.ocupedDriver(req.body.driver_id)(updateRunning)
                const returnRunning = await Business.returnRunningOne(req.params.id)(ocupedDriver)
                returnRunning.dataValues.status = 4
                // const acceptMongodb = await Business.acceptMongodb(req.body.driver_id)(returnRunning)
                const listDeviceClient = await Business.listDeviceClient(returnRunning)
                const listOneDriver = await Business.listOneDriver(req.body.driver_id)(listDeviceClient)
                const logSendRunning = await Business.logSendRunning(req, 'Corrida Aceita', listOneDriver.driver)(listOneDriver)
                const runningPush = await Business.runningPush(req.params.id)
                runningPush.dataValues.status = 4
                const tratamentPushNotification = await Business.tratmentPushNotificationClientAccept(runningPush)(logSendRunning)

                const listRanking = await Business.listOneRankingActive(rates)
                if (listRanking) {
                    const holiday = await Business.listHoliday({ city_id: rates.city_id, country_id: rates.country_id, state_id: rates.state_id })
                    const isHoliday = Business.rulesRanking(req.body, listRanking, holiday)
                    await Business.rankingDriver(isHoliday, returnRunning, true)
                    eventEmitter.emit('running_delivery', { running_id: returnRunning, user_id: returnRunning.dataValues.user_id })
                    res.status(200).json(tratamentPushNotification)
                } else {
                    eventEmitter.emit('running_delivery', { running_id: returnRunning, user_id: returnRunning.dataValues.user_id })
                    res.status(200).json(tratamentPushNotification)
                }
            } catch (err) {
                res.status(500).json(err)
            }
        },
        progress: eventEmitter => async (req, res) => {
            try {
                const query = {
                    where: {
                        $and: [
                            {
                                id: req.params.id
                            },
                            {
                                status: 4
                            },
                            {
                                driver_id: req.body.driver_id
                            }
                        ]
                    }
                }
                const mod = {
                    status: 5
                }

                // log
                const searchRunningTemp = await Business.searchRunningTemp(req.params.id)
                const listDriversSend = await Business.searchTempBlockDrivers(req.params.id)
                if (listDriversSend) listDriversSend.map(value => Business.ocupedStatusDriver(false, value))
                if (searchRunningTemp) {
                    await Business.blockTempDriverDelete(searchRunningTemp)
                    await Business.blockRunningTempDriverDelete(searchRunningTemp)
                }
                // 
                const returnRunningOne = await Business.returnRunningOne(req.params.id)()
                const listDeviceClient = await Business.listDeviceClient(returnRunningOne)
                returnRunningOne.dataValues.status = 5
                const listOneDriver = await Business.listOneDriver(req.body.driver_id)(listDeviceClient)
                const runningPush = await Business.runningPush(req.params.id)
                runningPush.dataValues.status = 5
                const tratmentPushNotificationClientProgress = await Business.tratmentPushNotificationClientProgress(runningPush)(listOneDriver)
                const updateAcceptRunning = await Business.updateAcceptRunning(query, mod)(tratmentPushNotificationClientProgress)
                const logSendRunning = await Business.logSendRunning(req, 'Corrida Iniciada', listOneDriver.driver)(updateAcceptRunning)
                eventEmitter.emit('running_delivery', { running_id: returnRunningOne, user_id: returnRunningOne.dataValues.user_id })
                res.status(200).json(logSendRunning)
            } catch (err) {
                console.log(err)
                await Business.rowBackRunningDelivery(req, 4)
                res.status(400).json(err)
            }
        },
        finishFreeDriver: (req, res) => {
            const query = {
                id: req.params.id
            }
            const mod = {
                freeDriver: false
            }
            Persistence.update(query, mod, res)
        },
        freeProgress: (req, res) => {
            const query = {
                id: req.params.id
            }
            const mod = {
                free: true
            }
            Persistence.update(query, mod, res)
        },
        finish: eventEmitter => async (req, res) => {
            try {
                const query = {
                    where: {
                        $and: [{
                            id: req.params.id
                        },
                        {
                            status: 5
                        }
                        ]
                    }
                }
                const mod = {
                    status: 6
                }
                const desocuped = await Business.desocuped(req.body)
                const returnRunningOne = await Business.returnRunningOne(req.params.id)(desocuped)
                const listDeviceClient = await Business.listDeviceClient(returnRunningOne)
                const listOneDriver = await Business.listOneDriver(req.body.driver_id)(listDeviceClient)
                const runningPush = await Business.runningPush(req.params.id)
                runningPush.dataValues.status = 6
                const tratmentPushNotificationClientFinish = await Business.tratmentPushNotificationClientFinish(runningPush)(listOneDriver)
                const updateAcceptRunning = await Business.updateAcceptRunning(query, mod)(tratmentPushNotificationClientFinish)
                const logSendRunning = await Business.logSendRunning(req, 'Corrida Finalizada', listOneDriver.driver)(updateAcceptRunning)

                if (returnRunningOne.dataValues.user_id) {
                    Business.sendEmailRunningFinish(req.params.id)
                    eventEmitter.emit('running_delivery', { running_id: returnRunningOne, user_id: returnRunningOne.dataValues.user_id })
                }
                res.status(200).json(logSendRunning)
            } catch (err) {
                console.log(err)
                const rowBackRunningDelivery = await Business.rowBackRunningDelivery(req, 5)
                await Business.rowBackMongodbDriver(req.body)(rowBackRunningDelivery)
                res.status(400).json(err)
            }
        },
        freeDriver: (req, res) => {
            const query = {
                $and: [{
                    id: req.params.id
                },
                {
                    status: 5
                }
                ]
            }
            const mod = {
                freeDriver: true
            }
            Persistence.update(query, mod, res)
        },
        cancelRunningDriver: eventEmitter => async (req, res) => {
            try {
                const blackList = await Business.blackList(req)
                const cancelMongoDB = await Business.cancelMongodb(blackList)
                const removeDriver = await Business.removeDriver(cancelMongoDB)
                const blackListDriver = await Business.blackListDriver(req.params.id, req.body)(removeDriver)
                const statusDriverMysql = await Business.statusDriverMysql(req.body)(blackListDriver)
                const returnStatusRunning = await Business.returnStatusRunning(req.params.id)(statusDriverMysql)
                const deviceList = await Business.deviceList(req.user)(returnStatusRunning)
                const pushNotificationCancel = await Business.pushNotificationCancel(req.params.id)(deviceList)
                const returnRunningOne = await Business.returnRunningOne(req.params.id)(pushNotificationCancel)
                const deviceListClient = await Business.deviceList()(returnRunningOne)
                const runningPush = await Business.runningPush(req.params.id)
                runningPush.dataValues.status = 3
                const listOneDriver = await Business.listOneDriver(req.body.driver_id)()
                const tratmentPushNotificationClient = await Business.tratmentPushNotificationClient(runningPush)(deviceListClient)
                await Business.logSendRunning(req, 'Corrida Cancelada Pelo o Motorista Atribuido', listOneDriver.driver)(tratmentPushNotificationClient)
                const listRanking = await Business.listOneRankingActive({ service_id: returnRunningOne.dataValues.service_id })
                
                if (listRanking) {
                    const rates = await Business.restesListOne2(returnRunningOne.dataValues.RequestDeliveries[0].rate_id)
                    const holiday = await Business.listHoliday({ city_id: rates.city_id, country_id: rates.country_id, state_id: rates.state_id })
                    let isHoliday = Business.rulesCancelRanking({}, listRanking, holiday)
                    isHoliday.driver_id = req.body.driver_id
                    await Business.rankingDriver(isHoliday, returnRunningOne.dataValues, false)
                    eventEmitter.emit('running_delivery', { running_id: returnRunningOne, user_id: returnRunningOne.dataValues.user_id })
                    res.status(200).json({ title: 'Alterado com sucesso!', message: 'Conseguimos alterar o seu registro com sucesso!' })
                } else {
                    eventEmitter.emit('running_delivery', { running_id: returnRunningOne, user_id: returnRunningOne.dataValues.user_id })
                    res.status(200).json({ title: 'Alterado com sucesso!', message: 'Conseguimos alterar o seu registro com sucesso!' })
                }
            } catch (err) {
                res.status(400).json(err)
            }
        },
        cancelDriver: async (req, res) => {
            try {
                const blackList = await Business.blackList(req)
                const cancelMongodb = await Business.cancelMongodb(blackList)
                const removeDriver = await Business.removeDriver(cancelMongodb)
                const blackListDriver = await Business.blackListDriver(req.params.id, req.body)(removeDriver)
                const deviceList = await Business.deviceList(req.user)(blackListDriver)
                const pushNotificationCancel = Business.pushNotificationCancel(req.params.id)(deviceList)
                const tratmentPushNotificationClient = await Business.tratmentPushNotificationClient(req.params.id)(pushNotificationCancel)
                const pushNotificationClient = await Business.pushNotificationClient(tratmentPushNotificationClient)
                const searchDriverPush = await Business.searchDriverPush(req.body.driver_id)(pushNotificationClient)
                const returnStatusRunning = await Business.returnStatusRunning(req.params.id)(searchDriverPush)
                res.status(200).json(returnStatusRunning)
            } catch (err) {
                res.status(400).json(err)
            }
        },
        cancelUser: async (req, res) => {
            Business.searchRunning(req.params.id)
                .then(async running => {
                    if (running) {
                        const typePayment = parseInt(running.dataValues.RequestDeliveries[0].dataValues.typePayment)
                        if (typePayment === 2) {
                            try {
                                const transactionListOne = await Business.transactionListOne(running)
                                await Business.moneyBackCardCielo(transactionListOne)
                                const driverToken = await Business.driverToken(running)
                                const pushNotificationCancel = await Business.pushNotificationCancel(req.params.id)(driverToken)
                                const desocupedDriver = await Business.desocupedDriver(pushNotificationCancel)
                                const desocupedDriverMysql = await Business.desocupedDriverMysql(req.params.id)(desocupedDriver)
                                const RunningDeliveryCancel = await Business.RunningDeliveryCancel(req.params.id)(desocupedDriverMysql)
                                if (running.dataValues.driver_id) {
                                    const listDriverOne = await Business.listOneDriver(running.dataValues.driver_id)()
                                    await Business.logSendRunning(req, 'Corrida Cancelada Pelo o Usuário', listDriverOne.driver)(RunningDeliveryCancel)
                                } else {
                                    await Business.logSendRunning(req, 'Corrida Cancelada Pelo o Usuário', { })(RunningDeliveryCancel)
                                }
                                const refundExtracDaily = await Business.refundExtracDaily(running)(RunningDeliveryCancel)
                                res.status(200).json([refundExtracDaily])
                            } catch (err) {
                                res.status(500).json(err)
                            }
                        } else if (typePayment === 3) {
                            try {
                                const driverToken = await Business.driverToken(running)
                                const pushNotificationCancel = await Business.pushNotificationCancel(req.params.id)(driverToken)
                                const desocupedDriver = await Business.desocupedDriver(pushNotificationCancel)
                                if (running.dataValues.driver_id) {
                                    await Business.desocupedDriverMysql(running.dataValues.driver_id)(desocupedDriver)
                                    const listDriverOne = await Business.listOneDriver(running.dataValues.driver_id)()
                                    await Business.logSendRunning(req, 'Corrida Cancelada Pelo o Usuário', listDriverOne.driver)()
                                }
                                await Business.moneyBackBalance(running)(desocupedDriver)
                                const financialTransaction = await FinancialTransactionBusiness.doLogTransactionReversal(running)
                                const deliveryCancel = await Business.RunningDeliveryCancel(req.params.id)(financialTransaction)
                                const refundExtracDaily = await Business.refundExtracDaily(running)(deliveryCancel)
                                res.status(200).json([refundExtracDaily])
                            } catch (err) {
                                console.log(err)
                                res.status(500).json(err)
                            }
                        } else if (typePayment === 1) {
                            try {
                                const driverToken = await Business.driverToken(running)
                                const pushNotificationCancel = await Business.pushNotificationCancel(req.params.id)(driverToken)
                                const desocupedDriver = await Business.desocupedDriver(pushNotificationCancel)
                                const desocupedDriverMysql = await Business.desocupedDriverMysql(running.dataValues.driver_id)(desocupedDriver)
                                const deliveryCancel = await Business.RunningDeliveryCancel(req.params.id)(desocupedDriverMysql)
                                if (running.dataValues.driver_id) {
                                    const listOneDriver = await Business.listOneDriver(running.dataValues.driver_id)()
                                    await Business.logSendRunning(req, 'Corrida Cancelada Pelo o Usuário', listOneDriver.driver)()
                                } else {
                                    await Business.logSendRunning(req, 'Corrida Cancelada Pelo o Usuário', {})()
                                }
                                const refund = await Business.refundExtracDaily(running)(deliveryCancel)
                                res.status(200).json([refund])
                            } catch (err) {
                                res.status(500).json(err)
                            }
                        }
                    } else {
                        res.status(400).json([{ title: 'Corrida', message: 'Corrida inexistente!' }])
                    }
                })
                .catch(err => res.status(500).json(err))
        },
        listRuningCompanyLastday: (req, res) => {
            const query = {
                where: {
                    $and: [{
                        company_id: req.params.company_id
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
        userHistoric: (req, res) => {
            RunningDelivery.findAndCountAll({
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
                        model: RequestDelivery
                    }
                ],
                order: [
                    ['created_at', 'DESC']
                ]
            })
                .then(running => res.status(200).json(running))
                .catch(err => res.status(500).json(err))
        },
        currentWeekByDriver: (req, res) => {
            let initDate = moment(req.params.init).utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 1 }).toISOString()
            let finishDate = moment(req.params.init).utcOffset(0).set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).toISOString()
            RunningDelivery.findAll({
                where: {
                    created_at: { $between: [initDate, finishDate] },
                    driver_id: req.params.driver_id,
                    status: [6, 10]
                },
                include: { all: true }
            })
                .then(runnings => res.status(200).json(runnings))
                .catch(err => res.status(500).json(err))
        },
        update: (req, res) => {
            const query = req.params
            const mod = req.body
            Persistence.update(query, mod, res)
        },
        listOne: (req, res) =>
            Persistence.listOneNotWhere({
                where: req.params,
                include: [
                    {
                        model: RequestDelivery,
                        include: {
                            model: ClientCompany,
                            attributes: ['name']
                        }
                    },
                    {
                        model: Driver,
                        attributes: ['id'],
                        include: [{
                            model: User,
                            attributes: ['name', 'number', 'ddd', 'ddi', 'email', 'avatar']
                        }]
                    }
                ]
            }, res),
        copy: (req, res) =>
            RunningDelivery.findOne({
                where: {
                    id: req.params.id
                },
                include: {
                    all: true
                }
            })
                .then(Business.copy)
                .then(Business.companyIsBalance)
                .then(Business.validateIsCompany)
                .then(Business.requestDeliveriesCreate(Business))
                .then(Business.runnginCreate)
                .then(FinancialTransactionBusiness.doLogTransactionDebitCopy)
                .then(Business.removeBalanceCompany)
                .then(resp => res.status(200).json(resp))
                .catch(err => res.status(500).json(err))
    }
}
