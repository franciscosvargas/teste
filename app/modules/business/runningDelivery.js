module.exports = app => {
    const Driver = app.datasource.models.Driver
    const User = app.datasource.models.User
    const Devices = app.datasource.models.Devices
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RequestDelivery = app.datasource.models.RequestDelivery
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const Company = app.datasource.models.Company
    const Ranking = app.datasource.models.Ranking
    const RunningTemp = app.datasource.models.RunningTemp
    const BlockTemp = app.datasource.models.BlockTemp
    const RankingInDriver = app.datasource.models.RankingInDriver
    const LogSendNotificationRunning = app.datasource.models.LogSendNotificationRunning
    const TransactionCardCielo = app.datasource.models.TransactionCardCielo
    const DriverDelivery = require('../schema/searchDriverDelivery')
    const Firebase = require('../../helpers/firebase')
    const Rates = app.datasource.models.Rates
    const Holidays = app.datasource.models.Holidays
    const ExtractDaily = app.datasource.models.ExtractDaily
    const Vehicles = app.datasource.models.Vehicles
    const Services = app.datasource.models.Services
    const Pagarme = require('../../helpers/pagarme')
    const TratmentPagarme = require('../../helpers/tratmentPagarme')
    const Onesignal = require('../../helpers/oneSignal')
    const LastLocation = app.datasource.models.LastLocation
    const SendEmail = require('../../helpers/sendEmailAws')(app)
    const Cielo = require('../../helpers/cielo')

    const moment = require('moment')

    const validateUpdate = object => object[0] ? {
        title: 'Alterado com sucesso!',
        message: 'Conseguimos alterar o seu registro com sucesso!'
    } : {
            title: 'Error em alterar!',
            message: 'Não foi possivel efetuar atualização, tente novamente!'
        }

    const isRates = {
        title: 'Serviço!',
        message: 'Serviço não existe!'
    }

    const isDay = new Array('domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado')

    const whatADay = (Date, isDay) => isDay[Date]

    const whatHour = (Date) => parseInt(Date)

    return {
        daily: object => Rates => {
            if (!object.diary) {
                const objectCreate = {
                    value: parseFloat(Rates.dailyValue),
                    service_id: object.driver.service_id,
                    driver_id: object.driver_id
                }
                return ExtractDaily.create(objectCreate)
            } else {
                const query = {
                    where: {
                        $and: [{
                            driver_id: object.driver_id
                        }, {
                            service_id: object.service_id
                        }]
                    }
                }
                const mod = {
                    driver_id: object.driver_id
                }
                return ExtractDaily.update(mod, query)
            }
        },
        sendEmailRunningFinish: async id => {
            const Template = require('../../templates/running-receipt.html')
            const description = '[Recibo] Sua viagem com o IUVO Club'
            const running = await RunningDelivery.findOne({
                where: { id: id },
                include: [
                    {
                        model: RequestDelivery
                    }, {
                        model: User,
                        attributes: ['name', 'email']
                    }, {
                        model: Driver,
                        include: [
                            {
                                model: User,
                                attributes: ['name']
                            },
                            {
                                model: Vehicles,
                                attributes: ['model']
                            }
                        ]
                    }, {
                        model: Services,
                        attributes: ['name']
                    }
                ]
            })
            SendEmail.send({
                userName: running.dataValues.User.dataValues.name,
                email: running.dataValues.User.dataValues.email,
                driverName: running.dataValues.Driver.dataValues.User.dataValues.name,
                price: running.dataValues.value.replace('.', ','),
                date: moment(running.dataValues.created_at).format('LL'),
                created_at: moment(running.dataValues.created_at).format('HH:mm'),
                updated_at: moment(running.dataValues.updated_at).format('HH:mm'),
                destinationAddresses: running.dataValues.RequestDeliveries[0].dataValues.destinationAddresses,
                originAddresses: running.dataValues.RequestDeliveries[0].dataValues.originAddresses,
                duration: running.dataValues.RequestDeliveries[0].dataValues.duration,
                kilometers: running.dataValues.RequestDeliveries[0].dataValues.kilometers,
                Vehicles: running.dataValues.Driver.dataValues.Vehicle.dataValues.model,
                service: running.dataValues.Service.dataValues.name
            }, Template, description)
        },
        deleteSearchDriverDelivery: object => response => {
            const query = {
                running_id: parseInt(object.params.id)
            }
            return DriverDelivery.remove(query).exec()
        },

        countRunningDrivers: req => new Promise(async (resolve, reject) => {
            try {
                const drivers = await RunningDelivery.findAll({
                    where: {
                        $and: [
                            { company_id: req.params.company_id },
                            { driver_id: { $ne: null } }
                        ]
                    },
                    group: ['driver_id'],
                    raw: true
                })
                const listDrivers = drivers.map(value => value.driver_id)
                resolve(listDrivers)
            } catch (err) {
                reject(err)
            }
        }),
        ocupedDriver: id => update => {
            const query = {
                where: {
                    id: id
                }
            }
            const mod = {
                ocuped: true,
                status: false,
                accept: true
            }
            return Driver.update(mod, query)
        },
        lastLocationUpdate: object => driver =>
            LastLocation.update({ driver_id: object.params.id }, {
                $set: {
                    service_id: object.body.service_id,
                    moneyDiscount: object.body.moneyDiscount,
                    cardDiscount: object.body.cardDiscount,
                    cardMarchine: object.body.cardMarchine,
                    acceptOnlyCard: object.body.acceptOnlyCard
                }
            }),
        lastLocationUpdateActive: object => driver => new Promise((resolve, reject) => {
            LastLocation.create({ driver_id: parseInt(object.params.id), service_id: driver.service_id, active: true, ocuped: false, status: driver.status })
                .then(last => resolve(driver))
                .catch(reject)
        }),

        updateAcceptRunning: (query, mod) => update => new Promise((resolve, reject) => {
            RunningDelivery.update(mod, query)
                .then(object =>
                    (object[0])
                        ? resolve(object)
                        : reject({ title: 'Error em alterar!', message: 'Não foi possivel efetuar atualização, tente novamente!' }))
                .catch(reject)
        }),
        rowBackRunningDelivery: (req, status) => RunningDelivery.update({ status: status }, { where: { id: req.params.id } }),
        rowBackMongodbDriver: (body) => update => LastLocation.update({ driver_id: body.driver_id }, { $set: { ocuped: false, status: false, accept: true } }),
        createDevice: driver => {
            const mod = {
                driver_id: driver.id,
                name: 'Init',
                tokenGcm: 1,
                serial: 1,
                user_id: driver.user_id
            }
            return Devices.create(mod)
        },

        returnRunningOne: id => update => {
            const query = {
                where: {
                    id: id
                },
                include: {
                    all: true
                }
            }
            return RunningDelivery.findOne(query)
        },

        acceptMongodb: id => object => new Promise((resolve, reject) => {
            LastLocation.update({ driver_id: id }, { $set: { accept: true } })
                .then(() => resolve(object))
                .catch(reject)
        }),
        listDeviceClient: object => new Promise((resolve, reject) => {
            Devices.findOne({ where: { user_id: object.dataValues.user_id }, raw: true })
                .then(device => resolve(Object.assign({
                    device: device,
                    object: object
                }, {})))
                .catch(reject)
        }),
        desocupedDriversList: object => update => new Promise((resolve, reject) => {
            DriverDelivery.findOne({ running_id: parseInt(object.params.id) })
                .then(list => {
                    if (list) {
                        if (list.driver1 !== null && object.body.driver.id === list.driver1) {
                            LastLocation.update({ driver_id: list.driver1 }, { $set: { ocuped: true, accept: true } })
                                .then(resp => {
                                    console.log(resp)
                                })
                                .catch(reject)
                        } else {
                            LastLocation.update({ driver_id: list.driver1 }, { $set: { ocuped: false } })
                                .then(resp => {
                                    console.log(resp)
                                })
                                .catch(reject)
                        }
                        if (list.driver2 !== null && object.body.driver.id === list.driver2) {
                            LastLocation.update({ driver_id: list.driver2 }, {
                                $set: {
                                    ocuped: true,
                                    accept: true
                                }
                            })
                                .then(resp => {
                                    console.log(resp)
                                })
                                .catch(reject)
                        } else {
                            LastLocation.update({ driver_id: list.driver2 }, {
                                $set: {
                                    ocuped: false
                                }
                            })
                                .then(resp => {
                                    console.log(resp)
                                })
                                .catch(reject)
                        }

                        if (list.driver3 !== null && object.body.driver.id === list.driver3) {
                            LastLocation.update({ driver_id: list.driver3 }, {
                                $set: {
                                    ocuped: true,
                                    accept: true
                                }
                            })
                                .then(resp => {
                                    console.log(resp)
                                })
                                .catch(reject)
                        } else {
                            LastLocation.update({ driver_id: list.driver3 }, {
                                $set: {
                                    ocuped: false
                                }
                            })
                                .then(resp => {
                                    console.log(resp)
                                })
                                .catch(reject)
                        }
                        resolve()
                    } else {
                        resolve()
                    }
                })
                .catch(reject)
        }),
        ratesListOne: object => new Promise((resolve, reject) => {
            Rates.findOne({ where: { service_id: object.driver.service_id }, raw: true })
                .then(rates => rates ? resolve(rates) : reject(isRates))
                .catch(reject)
        }),
        restesListOne2: id => Rates.findOne({ where: { id: id }, raw: true }),
        desocuped: object =>
            new Promise((resolve, reject) => {
                const query = {
                    where: {
                        id: object.driver_id
                    }
                }
                const mod = {
                    ocuped: false,
                    status: true,
                    accept: false
                }
                LastLocation.update(
                    {
                        driver_id: object.driver_id
                    }, {
                        $set: {
                            ocuped: false,
                            accept: false,
                            status: true
                        }
                    })
                    .then(mongodb => console.log(mongodb))
                    .catch(err => console.log(err))

                Driver.update(mod, query)
                    .then(object => resolve(validateUpdate(object)))
                    .catch(reject)
            }),

        driverToken: object => {
            const query = {
                where: {
                    driver_id: object.dataValues.driver_id
                },
                raw: true
            }
            return Devices.findOne(query)
        },

        moneyBackBalance: company => object => {
            let decrement = 0.0
            if (company.status === 4) {
                decrement = parseFloat(company.dataValues.value) - 2
            } else {
                decrement = parseFloat(company.dataValues.value)
            }
            return Company.increment(['balance'], {
                by: decrement,
                where: {
                    id: company.dataValues.company_id
                }
            })
        },

        moneyBackCardCielo: transaction =>
            Cielo.trasnactionRefund({paymentId: transaction.paymentId, amount: transaction.amount}),

        moneyBackCard: transaction => {
            const query = {
                id: transaction.pagarmeId
            }
            return Pagarme.reversalTransaction(query).then(TratmentPagarme.returnPagarme)
        },
        transactionListOne: object => new Promise((resolve, reject) => {
            const query = {
                where: {
                    $and: [
                        {
                            id: object.RequestDeliveries[0].dataValues.transaction_card_cielo_id
                        },
                        {
                            returnCode: ['4', '6']
                        }
                    ]
                },
                raw: true
            }
            TransactionCardCielo.findOne(query)
                .then(transaction => transaction ? resolve(transaction) : reject({
                    title: 'Transação',
                    message: 'Transação inexsitente!'
                }))
                .catch(reject)
        }),

        desocupedDriver: object => new Promise((resolve, reject) => {
            if (object) {
                const query = {
                    driver_id: object.driver_id
                }
                const mod = {
                    $set: {
                        ocuped: false,
                        status: true,
                        active: true,
                        accept: false,
                        block: false
                    }
                }

                LastLocation.update(query, mod)
                    .exec()
                    .then(resolve)
                    .catch(reject)
            } else {
                resolve(object)
            }
        }),
        desocupedDriverMysql: id => update => Driver.update({
            ocuped: false,
            status: true,
            accept: false
        }, {
                where: {
                    id: id
                }
            }),

        RunningDeliveryCancel: id => object => new Promise((resolve, reject) => {
            const query = {
                where: { id: id }
            }
            const mod = {
                status: 9
            }
            RunningDelivery.update(mod, query)
                .then(object => resolve(validateUpdate(object)))
                .catch(reject)
        }),
        pushNotificationCancel: id => device => new Promise((resolve, reject) => {
            if (device) {
                try {
                    const objectToken = {
                        data: {
                            title: 'Corrida Cancelada!',
                            message: {
                                running: id
                            }
                        },
                        token: device.tokenGcm
                    }
                    Firebase.pushNotification(objectToken, Firebase.validateResponse)
                        .then(() => resolve(device))
                        .catch(reject)
                } catch (err) {
                    throw new Error('Error push notification params')
                }
            } else {
                resolve(device)
            }
        }),
        pushNotificationTest: object => new Promise(async (resolve, reject) => {
            try {
                const objectGcm = {
                    data: {
                        title: 'Nova Corrida',
                        message: {
                            running: object.tratment
                        }
                    },
                    token: object.device.tokenGcm
                }
                await Firebase.pushNotification(objectGcm, Firebase.validateResponse)
                resolve(object)
            } catch (err) { reject(err) }
        }),
        pushNotification: (id) => RunningDelivery.findOne({
            where: {
                id: id
            },
            include: {
                all: true
            }
        }),
        deviceList: user => object => new Promise((resolve, reject) => {
            try {
                if (user !== undefined) {
                    Devices.findOne({ where: { user_id: user.object.id } }, { raw: true })
                        .then(resolve)
                        .catch(reject)
                } else {
                    Devices.findOne({ where: { user_id: object.dataValues.user_id } }, { raw: true })
                        .then(resolve)
                        .catch(reject)
                }
            } catch (err) {
                resolve()
            }
        }),
        deviceListTesst: id => object => new Promise((resolve, reject) => {
            Devices.findOne({ where: { driver_id: id } }, { raw: true })
                .then(devices => resolve(Object.assign({ tratment: object, device: devices }, {})))
                .catch(reject)
        }),
        tratmentPushNotificationClient: (running) => device => new Promise((resolve, reject) => {
            if (device) {
                try {
                    resolve({
                        message: {
                            'en': 'Corrida foi cancelada. Estamos procurando outro prestador!'
                        },
                        running: {
                            running_id: running,
                            user_id: running.dataValues.user_id,
                            cancel: true,
                            title: 'Corrida foi cancelada.',
                            message: 'Estamos procurando outro prestador!'
                        },
                        playerId: [device.tokenGcm]
                    })
                } catch (err) {
                    reject({
                        title: 'Error',
                        message: 'Error no push notification'
                    })
                }
            } else {
                resolve(device)
            }
        }),

        listOneDriver: id => object => new Promise((resolve, reject) => {
            Driver.findOne({
                where: {
                    id: id
                },
                include: [
                    { model: User, attributes: ['name'] }
                ]
            })
                .then(driver => resolve(Object.assign({ driver: driver.dataValues }, object)))
                .catch(reject)
        }),

        refundExtracDaily: running => object => new Promise(async (resolve, reject) => {
            if (running.dataValues.driver_id === null) {
                resolve(object)
            } else {
                let initDate = moment(new Date()).utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 1 }).toISOString()
                let finishDate = moment(new Date()).utcOffset(0).set({ hour: 23, minute: 59, second: 59, millisecond: 59 }).toISOString()

                const count = await RunningDelivery.count({
                    where: {
                        $and: [
                            { created_at: { $between: [initDate, finishDate] } },
                            { driver_id: running.dataValues.driver_id },
                            { status: [6, 10] }
                        ]
                    }
                })

                if (count === 0) {
                    await ExtractDaily.destroy({
                        where: {
                            $and: [
                                { driver_id: running.dataValues.driver_id },
                                { date: moment().format('YYYY-MM-DD') },
                                { service_id: running.dataValues.service_id }
                            ]
                        }
                    })
                    resolve(object)
                }
                resolve(object)
            }
        }),
        searchRunningTemp: id => {
            return RunningTemp.findOne({
                where: {
                    running_delivery_id: id
                },
                raw: true
            })
        },
        searchTempBlockDrivers: (running) => {
            return BlockTemp.findAll({
                where: {},
                attributes: ['id', 'driver_id'],
                include: [
                    {
                        model: RunningTemp,
                        required: true,
                        where: {
                            running_delivery_id: parseInt(running)
                        },
                        attributes: ['id']
                    }
                ],
                raw: true
            })
        },
        ocupedStatusDriver: (status, drivers) => {
            drivers.dataValues
                ? Driver.update({ ocuped: status }, { where: { id: drivers.dataValues.id, accept: false } })
                : Driver.update({ ocuped: status }, { where: { id: drivers.driver_id, accept: false } })
        },
        blockTempDriverTime: body => {
            return Driver.update({ block: true, blockTime: moment() }, {where: {id: body.driver_id}})
        },
        blockTempDriverDelete: running => {
            return BlockTemp.destroy({
                where: { running_temp_id: running.id }
            })
        },
        blockRunningTempDriverDelete: running => {
            return RunningTemp.destroy({ where: { id: running.id } })
        },
        logSendRunning: (req, text, driver) => object => new Promise((resolve, reject) => {
            const mod = {
                driver_id: req.body.driver_id ? req.body.driver_id : null,
                running_delivery_id: req.params.id,
                description: text,
                user_id: req.body.user_id ? req.body.user_id : null,
                driverLocation: driver.location
            }
            LogSendNotificationRunning.create(mod)
                .then(() => resolve(object))
                .catch(reject)
        }),
        runningPush: (id) => RunningDelivery.findOne({
            where: { id: id },
            include: [
                {
                    model: RequestDelivery,
                    required: true,
                    attributes: ['id', 'pointInit', 'typePayment', 'originAddresses', 'kilometers', 'pointFinish']
                }, {
                    model: User,
                    attributes: ['name', 'ddd', 'number', 'id']
                }, {
                    model: Company,
                    attributes: ['socialName', 'phone']
                }
            ]
        }),
        tratmentPushNotificationClientAccept: (running) => object => new Promise(async (resolve, reject) => {
            if (running.dataValues.user_id) {
                try {
                    const push = {
                        message: {
                            'en': `Corrida Aceita por ${object.driver.User.dataValues.name}`
                        },
                        running: {
                            running_id: running,
                            user_id: running.dataValues.user_id,
                            cancel: false,
                            title: `Corrida Aceita ${object.driver.User.dataValues.name}`,
                            message: `Corrida Aceita ${object.driver.User.dataValues.name}`
                        },
                        playerId: [object.device.tokenGcm]
                    }
                    await Onesignal.pushNotification(push)
                    resolve({ object: object })
                } catch (err) {
                    console.log(err.response.data)
                    reject(err)
                }
            } else {
                resolve({ object: object })
            }
        }),
        listOneRankingActive: rates => {
            let finishDate = moment().format('YYYY-MM-DD')
            return Ranking.findOne({
                where: {
                    $and: [
                        { dateFinish: { $gte: finishDate } },
                        { service_id: rates.service_id }
                    ]
                },
                // logging: console.log,
                raw: true
            })
        },
        listHoliday: (object) => {
            let finishDate = moment().format('YYYY-MM-DD')
            return Holidays.findOne({
                where: {
                    $and: [
                        { date: finishDate },
                        object
                    ]
                },
                raw: true
            })
        },
        rulesRanking: (body, object, holiday) => {
            let point = parseFloat(object.attendedRace)
            const day = whatADay(moment().day(), isDay)
            const hour = whatHour(moment().hour())
            if (day === 'sabádo') {
                body.raceOnSaturday = true
                point += object.raceOnSaturday
            }
            if (day === 'domingo') {
                point += parseFloat(object.holidayRun)
                body.holidayRun = true
            }
            if (hour <= 8 || hour > 22) {
                point += parseFloat(object.interspersedRunTime)
                body.interspersedRunTime = true
            }
            if (holiday) {
                point += parseFloat(object.holidayRun)
                body.holidayRun = true
            }
            body.listRanking = object.id
            body.points = parseFloat(point)
            return body
        },
        rulesCancelRanking: (body, object, holiday) => {
            let point = parseFloat(object.runCanceled * -1)
            const day = whatADay(moment().day(), isDay)
            const hour = whatHour(moment().hour())
            if (day === 'sabádo') {
                body.raceOnSaturday = true
                point -= parseFloat(object.raceOnSaturday)
            }
            if (day === 'domingo') {
                point -= parseFloat(object.holidayRun)
                body.holidayRun = true
            }
            if (hour <= 8 || hour > 22) {
                point -= parseFloat(object.interspersedRunTime)
                body.interspersedRunTime = true
            }
            if (holiday) point -= parseFloat(object.holidayRun)
            body.listRanking = object.id
            body.runCanceled = true
            body.points = point
            return body
        },
        rankingDriver: (isHoliday, returnRunning, accept) => {
            return RankingInDriver.create({
                status: true,
                runCanceled: isHoliday.runCanceled || false,
                attendedRace: accept,
                interspersedRunTime: isHoliday.interspersedRunTime || false,
                runningInTheRain: isHoliday.runningInTheRain || false,
                raceOnSaturday: isHoliday.raceOnSaturday || false,
                holidayRun: isHoliday.holidayRun || false,
                raceBetweenDates: isHoliday.raceBetweenDates || false,
                running_delivery_id: returnRunning.id,
                ranking_id: isHoliday.listRanking,
                points: isHoliday.points,
                driver_id: isHoliday.driver_id
            })
        },
        tratmentPushNotificationClientProgress: (running) => object => new Promise((resolve, reject) => {
            if (running.dataValues.user_id) {
                const push = {
                    message: {
                        'en': `Corrida Iniciada por ${object.driver.User.dataValues.name}`
                    },
                    running: {
                        running_id: running,
                        user_id: running.dataValues.user_id,
                        cancel: false,
                        title: `Corrida Iniciada ${object.driver.User.dataValues.name}`,
                        message: `Corrida Iniciada ${object.driver.User.dataValues.name}`
                    },
                    playerId: [object.device.tokenGcm]
                }
                Onesignal.pushNotification(push)
                    .then(() => resolve({ object: object }))
                    .catch(() => resolve({ object: object }))
            } else {
                resolve({ object: object })
            }
        }),
        tratmentPushNotificationClientFinish: (running) => object => new Promise((resolve, reject) => {
            if (running.dataValues.user_id) {
                const push = {
                    message: {
                        'en': `Corrida Finalizada por ${object.driver.User.dataValues.name}`
                    },
                    running: {
                        running_id: running,
                        user_id: running.dataValues.user_id,
                        cancel: false,
                        title: `Corrida Finalizada ${object.driver.User.dataValues.name}`,
                        message: `Corrida Finalizada ${object.driver.User.dataValues.name}`
                    },
                    playerId: [object.device.tokenGcm]
                }
                Onesignal.pushNotification(push)
                    .then(() => resolve({ object: object }))
                    .catch(() => resolve({ object: object }))
            } else {
                resolve({ object: object })
            }
        }),
        pushNotificationClient: object => new Promise(async (resolve, reject) => {
            try {
                if (object) {
                    await Onesignal.pushNotification(object)
                    resolve()
                }
            } catch (err) {
                resolve()
            }
        }),

        searchDriverPush: id => object => new Promise((resolve, reject) => {
            DriverDelivery.update({
                driver_id: id
            }, {
                    $set: {
                        $push: { blackList: [id] }
                    }
                })
                .then(() => resolve(object))
                .catch(reject)
        }),

        pushNotificationTaxi: (id) => RunningTaxiDriver.findOne({
            where: {
                id: id
            },
            include: {
                all: true
            }
        }),
        searchRunning: id => {
            const query = {
                where: {
                    $and: [{
                        id: parseInt(id)
                    }, {
                        status: {
                            $lte: 4
                        }
                    }]
                },
                include: {
                    all: true
                }
            }
            return RunningDelivery.findOne(query)
        },

        driverStatus: body => Driver.update({status: true, accept: false, ocuped: false}, {where: {id: body.driver_id}}),

        cancelMongodb: object => new Promise((resolve, reject) => {
            const query = {
                driver_id: parseInt(object.body.driver_id)
            }
            const mod = {
                $set: {
                    ocuped: false,
                    accept: false,
                    block: false,
                    status: true
                }
            }
            LastLocation.update(query, mod)
                .then((update) => {
                    Driver.update(
                        {
                            ocuped: false,
                            accept: false,
                            status: true,
                            block: false
                        }, {
                            where: {
                                id: object.body.driver_id
                            }
                        })
                        .then(resp => console.log(resp))
                        .catch(err => console.log(err))
                    resolve(object)
                })
                .catch(reject)
        }),

        blackList: object => new Promise((resolve, reject) => {
            const query = {
                running_id: parseInt(object.params.id),
                $or: [
                    {
                        driver1: parseInt(object.body.driver_id)
                    },
                    {
                        driver2: parseInt(object.body.driver_id)
                    },
                    {
                        driver3: parseInt(object.body.driver_id)
                    }
                ]
            }
            const mod = {
                $push: {
                    blackList: parseInt(object.body.driver_id)
                }
            }
            DriverDelivery.update(query, mod)
                .then(() => resolve(object))
                .catch(reject)
        }),
        blackListDriver: (id, body) => update => DriverDelivery.update({
            running_id: id
        }, {
                $set: { $push: { blackList: body.driver_id } }
            }),

        statusDriverMysql: body => update => Driver.update({ ocuped: false, block: true }, { where: { id: body.driver_id } }),
        statusDriverMongodb: body => update => LastLocation.update({ driver_id: body.driver_id }, { $set: { block: true, block_date: moment().toISOString() } }),

        removeDriver: object => new Promise((resolve, reject) => {
            try {
                const query = {
                    running_id: parseInt(object.params.id),
                    $or: [
                        {
                            driver1: parseInt(object.body.driver_id)
                        },
                        {
                            driver2: parseInt(object.body.driver_id)
                        },
                        {
                            driver3: parseInt(object.body.driver_id)
                        }
                    ]
                }
                DriverDelivery.findOne(query)
                    .lean()
                    .exec()
                    .then(driver => {
                        if (driver) {
                            if (driver.driver1 !== null && driver.driver1 === parseInt(object.body.driver_id)) {
                                const mod = {
                                    $set: {
                                        driver1: null
                                    }
                                }
                                DriverDelivery.update(query, mod)
                                    .then(update => {
                                        // console.log('remove', update)
                                        resolve(object)
                                    })
                                    .catch(reject)
                            }
                            if (driver.driver2 !== null && driver.driver2 === parseInt(object.body.driver_id)) {
                                const mod = {
                                    $set: {
                                        driver2: null
                                    }
                                }
                                DriverDelivery.update(query, mod)
                                    .then(update => {
                                        resolve(object)
                                    })
                                    .catch(reject)
                            }
                            if (driver.driver3 !== null && driver.driver3 === parseInt(object.body.driver_id)) {
                                const mod = {
                                    $set: {
                                        driver3: null
                                    }
                                }
                                DriverDelivery.update(query, mod)
                                    .then(update => {
                                        // console.log('remove', update)
                                        resolve(object)
                                    })
                                    .catch(reject)
                            }
                        } else {
                            resolve()
                        }
                    })
                    .catch(reject)
            } catch (err) {
                console.log(err)
            }
        }),
        returnStatusRunning: id => object => new Promise((resolve, reject) => {
            const query = {
                where: {
                    $and: [
                        {
                            id: id
                        },
                        {
                            status: {
                                $eq: 4
                            }
                        }
                    ]
                }
            }
            const mod = {
                status: 3,
                driver_id: null,
                freeDriver: false
            }
            RunningDelivery.update(mod, query)
                .then(object => resolve(validateUpdate(object)))
                .catch(reject)
        }),
        tratmentPushNotification: object => {
            try {
                const testando = {
                    request_id: object.RequestDeliveries[0].id,
                    running_delivery_id: object.id,
                    user: object.user_id !== null ? object.User.dataValues.name : null,
                    user_phone: object.user_id !== null ? `${object.User.dataValues.ddd}${object.User.dataValues.number}` : null,
                    company: object.company_id !== null ? object.Company.dataValues.socialName : null,
                    company_phone: object.company_id !== null ? object.Company.dataValues.phone : null,
                    originAddresses: object.RequestDeliveries[0].dataValues.originAddresses,
                    kilometers: object.RequestDeliveries[0].kilometers,
                    pointInit: object.RequestDeliveries[0].pointInit,
                    typePayment: object.RequestDeliveries[0].typePayment,
                    pointFinish: object.RequestDeliveries[0].pointFinish,
                    totalOrder: object.value
                }
                return testando
            } catch (err) {
                console.log(err)
                throw new Error('Error tratment notification')
            }
        },
        tratmentPushNotificationOneDriver: object => {
            try {
                return {
                    request_id: object.dataValues.RequestDeliveries[0].id,
                    running_delivery_id: object.dataValues.id,
                    user: object.user_id !== null ? object.dataValues.User.dataValues.name : null,
                    user_phone: object.user_id !== null ? `${object.dataValues.User.dataValues.ddd}${object.dataValues.User.dataValues.number}` : null,
                    company: object.company_id !== null ? object.dataValues.Company.dataValues.socialName : null,
                    company_phone: object.company_id !== null ? object.dataValues.Company.dataValues.phone : null,
                    originAddresses: object.RequestDeliveries[0].dataValues.originAddresses,
                    kilometers: object.RequestDeliveries[0].kilometers,
                    pointInit: object.RequestDeliveries[0].pointInit,
                    typePayment: object.RequestDeliveries[0].typePayment,
                    pointFinish: object.RequestDeliveries[0].pointFinish,
                    totalOrder: object.dataValues.value
                }
            } catch (err) {
                console.log(err)
                throw new Error('Error tratment notification')
            }
        },
        tratmentPushNotificationTest: object => {
            try {
                return {
                    request_id: object.dataValues.RequestDeliveries[0].id,
                    running_delivery_id: object.dataValues.id,
                    user: object.user_id !== null ? object.dataValues.User.dataValues.name : null,
                    user_phone: object.user_id !== null ? `${object.dataValues.User.dataValues.ddd}${object.dataValues.User.dataValues.number}` : null,
                    company: object.company_id !== null ? object.dataValues.Company.dataValues.socialName : null,
                    company_phone: object.company_id !== null ? object.dataValues.Company.dataValues.phone : null,
                    originAddresses: ` Iuvo Club Corrida Teste Prestador`,
                    kilometers: object.RequestDeliveries[0].kilometers,
                    pointInit: object.RequestDeliveries[0].pointInit,
                    typePayment: object.RequestDeliveries[0].typePayment,
                    pointFinish: object.RequestDeliveries[0].pointFinish,
                    totalOrder: object.dataValues.value
                }
            } catch (err) {
                console.log(err)
                throw new Error('Error tratment notification')
            }
        },
        tratmentPushNotificationTaxi: object => {
            try {
                const testando = {
                    request_taxi_id: object.RequestTaxiDrivers[0].id,
                    running_taxi_id: object.id,
                    user: object.user_id !== null ? object.User.dataValues.name : null,
                    user_phone: object.user_id !== null ? `${object.User.dataValues.ddd}${object.User.dataValues.number}` : null,
                    company: object.company_id !== null ? object.Company.dataValues.socialName : null,
                    company_phone: object.company_id !== null ? object.Company.dataValues.phone : null,
                    originAddresses: object.RequestTaxiDrivers[0].dataValues.originAddresses,
                    kilometers: object.RequestTaxiDrivers[0].kilometers,
                    pointInit: object.RequestTaxiDrivers[0].pointInit,
                    typePayment: object.RequestTaxiDrivers[0].typePayment,
                    pointFinish: object.RequestTaxiDrivers[0].pointFinish,
                    totalOrder: object.value
                }
                return testando
            } catch (err) {
                throw new Error('Error tratment push notification')
            }
        },
        copy: object => new Promise((resolve, reject) =>
            (object)
                ? resolve({
                    running: object.dataValues,
                    request: object.dataValues.RequestDeliveries
                })
                : reject({
                    title: 'Corrida',
                    message: 'Corrida não existe!'
                })),

        companyIsBalance: object => new Promise((resolve, reject) => {
            const query = {
                where: {
                    $and: [{
                        id: object.running.company_id
                    },
                    {
                        balance: {
                            $gte: object.running.value
                        }
                    }
                    ]
                }
            }
            Company.findOne(query)
                .then(company => {
                    if (company) {
                        Company.increment(['balance'], {
                            by: parseFloat(object.running.value),
                            where: {
                                id: object.company_id
                            }
                        }).then(() => {
                            resolve(Object.assign({
                                company: company
                            }, object))
                        })
                    } else {
                        reject({
                            title: 'Saldo',
                            message: 'Saldo insuficente!'
                        })
                    }
                })
                .catch(reject)
        }),

        validateIsCompany: object =>
            new Promise((resolve, reject) =>
                (object.company)
                    ? resolve(object)
                    : reject({
                        title: 'Empresa',
                        message: 'Empresa não possui saldo suficiente!'
                    })
            ),
        createRequest: object => RequestDelivery.create(object),

        modReduceRequest: (request, help) => new Promise((resolve, reject) => {
            let resp = []
            request.map((current, index) => {
                const mod = current.dataValues
                delete mod['id']
                delete mod['running_delivery_id']
                delete mod['created_at']
                delete mod['updated_at']
                if (request.length === index + 1) {
                    RequestDelivery.create(mod)
                        .then(mod => {
                            resp.push(mod.dataValues)
                            resolve(resp)
                        })
                        .catch(reject)
                } else {
                    RequestDelivery.create(mod)
                        .then(mod => resp.push(mod.dataValues))
                        .catch(reject)
                }
            })
        }),
        requestDeliveriesCreate: help => object => new Promise((resolve, reject) => {
            try {
                help.modReduceRequest(object.request, help)
                    .then(resp => {
                        // console.log('estou aqui resp', resp)
                        resolve(Object.assign({ requestCreated: resp }, object))
                    })
                    .catch(reject)
            } catch (err) {
                console.log(err)
                reject({ title: 'Pedido', message: 'Pedido não existe!' })
            }
        }),
        runnginCreate: object => new Promise((resolve, reject) => {
            const running = object.running
            delete running['Company']
            delete running['id']
            delete running['Driver']
            delete running['driver_id']
            delete running['RequestDeliveries']
            delete running['created_at']
            delete running['updated_at']
            running.status = 2
            RunningDelivery.create(running)
                .then(running => {
                    const query = {
                        where: { id: object.requestCreated.map(value => value.id) }
                    }
                    const mod = {
                        running_delivery_id: running.dataValues.id
                    }

                    RequestDelivery.update(mod, query)
                        .then(() => resolve(running))
                        .catch(reject)
                })
                .catch(reject)
        }),
        removeBalanceCompany: object => new Promise((resolve, reject) => {
            Company.findById(object.company_id)
                .then(resp => {
                    resp.decrement('balance', { by: parseFloat(object.value) })
                })
                .then(() => resolve(object))
                .catch(reject)
        }),
        // Este método intercepta a requisição e se usuário for um cliente, é mostrado somente os Driver que prestaram serviço para o cliente da requisição
        getRunningsByUser: (req) => new Promise((resolve, reject) => {
            try {
                if (!req.user.object.master) {
                    const whereObj = {}

                    if (req.user.object.Companies.length > 0) {
                        let ids = req.user.object.Companies.map(company => company.id)
                        whereObj.company_id = ids
                    } else {
                        whereObj.user_id = req.user.object.id
                    }

                    RunningDelivery.findAll({ where: whereObj, raw: true })
                        .then(runnings => {
                            let tempArray = runnings.filter(rn => {
                                return rn.driver_id
                            }).map(rn => rn.driver_id).filter((value, index, self) => {
                                return self.indexOf(value) === index
                            })
                            req.query.id = tempArray
                            resolve(req)
                        })
                        .catch(() => reject({ title: 'Ops', message: 'Não foi possivel requisitar a lista de prestadores.' }))
                } else {
                    resolve(req)
                }
            } catch (ex) {
                reject({ title: 'Ops', message: 'Não foi possivel requisitar a lista de prestadores.' })
            }
        })
    }
}
