module.exports = app => {
    const TransactionCard = app.datasource.models.TransactionCard
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const RequestTaxiDriver = app.datasource.models.RequestTaxiDriver
    const Driver = app.datasource.models.Driver
    const Card = app.datasource.models.Card
    const RunningTemp = app.datasource.models.RunningTemp
    const Holidays = app.datasource.models.Holidays
    const City = app.datasource.models.City
    const BlockTemp = app.datasource.models.BlockTemp
    const State = app.datasource.models.State
    const Country = app.datasource.models.Country
    const User = app.datasource.models.User
    const Address = app.datasource.models.Address
    const Devices = app.datasource.models.Devices
    const Company = app.datasource.models.Company
    const Vehicles = app.datasource.models.Vehicles
    const Services = app.datasource.models.Services
    const PromoCode = app.datasource.models.PromoCode
    const LogSendNotificationRunning = app.datasource.models.LogSendNotificationRunning
    const DriverDelivery = require('../schema/searchDriverDelivery')
    const Firebase = require('../../helpers/firebase')
    const Regex = require('../../helpers/regex')
    const Rates = app.datasource.models.Rates
    const TransactionCardCielo = app.datasource.models.TransactionCardCielo
    const ExtractDaily = app.datasource.models.ExtractDaily
    const LastLocation = app.datasource.models.LastLocation
    const url = require('../../config/key').pagarme
    const Help = require('../../helpers/tratmentPagarme')
    const Pagarme = require('../../helpers/pagarme')
    const SendEmail = require('../../helpers/sendEmailAws')(app)
    const Cielo = require('../../helpers/cielo')
    const moment = require('moment-timezone').tz.setDefault('America/Recife')

    const Onesignal = require('../../helpers/oneSignal')

    const whatADay = (Date, isDay) => isDay[Date]
    const whatHour = (Date) => parseInt(Date)

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
    return {
        daily: object => Rates => {
            if (!object.diary) {
                const objectCreate = {
                    value: Rates.dailyValue,
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
            const running = await RunningTaxiDriver.findOne({
                where: {id: id},
                include: [
                    {
                        model: RequestTaxiDriver
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
                destinationAddresses: running.dataValues.RequestTaxiDrivers[0].dataValues.destinationAddresses,
                originAddresses: running.dataValues.RequestTaxiDrivers[0].dataValues.originAddresses,
                duration: running.dataValues.RequestTaxiDrivers[0].dataValues.duration,
                kilometers: running.dataValues.RequestTaxiDrivers[0].dataValues.kilometers,
                Vehicles: running.dataValues.Driver.dataValues.Vehicle.dataValues.model,
                service: running.dataValues.Service.dataValues.name
            }, Template, description)
        },
        deleteSearchDriverDelivery: object => update => {
            const query = {
                running_id_taxi: parseInt(object.params.id)
            }
            return DriverDelivery.remove(query).exec()
        },

        listDeviceClient: object => new Promise((resolve, reject) => {
            Devices.findOne({where: {user_id: object.dataValues.user_id}}, {raw: true})
                .then(device => device ? resolve(Object.assign({
                    device: device,
                    running: object
                }, {})) : reject({'title': 'Dispositivo', message: 'Usuário não possui dispositivo!'}))
                .catch(reject)
        }),

        listDeviceClientFinish: running => object => new Promise((resolve, reject) => {
            Devices.findOne({where: {user_id: running.dataValues.user_id}}, {raw: true})
                .then(device => device ? resolve(Object.assign({
                    device: device,
                    running: object
                }, {})) : reject({'title': 'Dispositivo', message: 'Usuário não possui dispositivo!'}))
                .catch(reject)
        }),

        listOneDriver: id => object => new Promise((resolve, reject) => {
            Driver.findOne({
                where: {
                    id: id
                },
                include: [
                    {model: User, attributes: ['name']}
                ]
            })
                .then(driver => driver ? resolve(Object.assign({driver: driver.dataValues}, object)) : reject({
                    title: 'Error',
                    message: 'Motorista não existe!'
                }))
                .catch(reject)
        }),
        updateFreeDriver: body => {
            return Driver.update({status: true, accept: false, ocuped: false}, {where: {id: body.driver_id}})
        },
        logSendRunning: (req, text, driver) => object => new Promise((resolve, reject) => {
            const mod = {
                driver_id: req.body.driver_id ? req.body.driver_id : null,
                running_taxi_driver_id: req.params.id,
                description: text,
                user_id: req.body.user_id ? req.body.user_id : null,
                driverLocation: driver.location
            }
            LogSendNotificationRunning.create(mod)
                .then(() => resolve(object))
                .catch(reject)
        }),
        pushNotificationClientFinish: (running) => object => new Promise((resolve, reject) => {
            try {
                if (running.dataValues.user_id) {
                    const push = {
                        message: {
                            'en': `Corrida Finalizada por ${object.driver.User.dataValues.name}`
                        },
                        running: {
                            running_id: running,
                            user_id: running.dataValues.user_id,
                            service_id: object.running.service_id,
                            cancel: false,
                            title: `Corrida Finalizada ${object.driver.User.dataValues.name}`,
                            message: `Corrida Finalizada ${object.driver.User.dataValues.name}`
                        },
                        playerId: [object.device.tokenGcm]
                    }
                    Onesignal.pushNotification(push)
                        .then(() => resolve({object: object.running}))
                        .catch(() => resolve({object: object.running}))
                } else {
                    resolve({object: object.running})
                }
            } catch (err) {
                console.log(err)
            }
        }),
        runningPush: (id) => RunningTaxiDriver.findOne({
            where: {id: id},
            include: [
                {
                    model: RequestTaxiDriver,
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
        searchRunningTemp: id => {
            return RunningTemp.findOne({
                where: {
                    running_taxi_driver_id: id
                },
                raw: true
            })
        },
        ocupedStatusDriver: (status, drivers) => {
            drivers.dataValues
                ? Driver.update({ocuped: status}, {where: {id: drivers.dataValues.id, accept: false}})
                : Driver.update({ocuped: status}, {where: {id: drivers.driver_id, accept: false}})
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
                            running_taxi_driver_id: parseInt(running)
                        },
                        attributes: ['id']
                    }
                ],
                raw: true
            })
        },
        blockTempDriverDelete: running => {
            return BlockTemp.destroy({
                where: {running_temp_id: running.id}
            })
        },
        blockRunningTempDriverDelete: running => {
            return RunningTemp.destroy({where: {id: running.id}})
        },
        pushNotificationClientAccept: (running) => object => new Promise((resolve, reject) => {
            try {
                if (running.dataValues.user_id) {
                    const push = {
                        message: {
                            'en': `Corrida Aceita por ${object.driver.User.dataValues.name}`
                        },
                        running: {
                            running_id: running,
                            user_id: running.dataValues.user_id,
                            service_id: running.dataValues.service_id,
                            cancel: false,
                            title: `Corrida Aceita ${object.driver.User.dataValues.name}`,
                            message: `Corrida Aceita ${object.driver.User.dataValues.name}`
                        },
                        playerId: [object.device.tokenGcm]
                    }
                    Onesignal.pushNotification(push)
                        .then(() => resolve({object: object.running}))
                        .catch(() => resolve({object: object.running}))
                } else {
                    resolve({object: object.running})
                }
            } catch (err) {
                console.log(err)
            }
        }),

        pushNotificationClientProgress: (running) => object => new Promise((resolve, reject) => {
            try {
                if (running.dataValues.user_id) {
                    const push = {
                        message: {
                            'en': `Corrida Iniciada por ${object.driver.User.dataValues.name}`
                        },
                        running: {
                            running_id: running,
                            user_id: running.dataValues.user_id,
                            service_id: object.running.service_id,
                            cancel: false,
                            title: `Corrida Iniciada ${object.driver.User.dataValues.name}`,
                            message: `Corrida Iniciada ${object.driver.User.dataValues.name}`
                        },
                        playerId: [object.device.tokenGcm]
                    }
                    Onesignal.pushNotification(push)
                        .then(() => resolve({object: object.running}))
                        .catch(() => resolve({object: object.running}))
                } else {
                    resolve({object: object.running})
                }
            } catch (err) {
                console.log(err)
            }
        }),
        pushNotificationClientCancel: (running) => object => new Promise(async (resolve, reject) => {
            try {
                if (running.dataValues.user_id) {
                    const push = {
                        message: {
                            'en': `Corrida foi cancelada. Estamos procurando outro prestador!`
                        },
                        running: {
                            running_id: running,
                            user_id: running.dataValues.user_id,
                            cancel: false,
                            title: `Corrida foi cancelada. Estamos procurando outro prestador!`,
                            message: `Corrida foi cancelada. Estamos procurando outro prestador!`
                        },
                        playerId: [object.device.tokenGcm]
                    }
                    Onesignal.pushNotification(push)
                    resolve({object: object})
                } else {
                    resolve({object: object})
                }
            } catch (err) {
                reject(err.response.data)
                console.log(err)
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
                accept: true
            }
            return Driver.update(mod, query)
        },
        ocupedDriverMongo: id => update => LastLocation.update({driver_id: id}, {$set: {ocuped: true, accept: true}}),
        updateAcceptRunning: (query, mod) => update => new Promise((resolve, reject) => {
            RunningTaxiDriver.update(mod, query)
                .then(object => {
                    object[0]
                        ? resolve(object)
                        : reject({
                            title: 'Error em alterar!',
                            message: 'Não foi possivel efetuar atualização, tente novamente!'
                        })
                })
                .catch(reject)
        }),
        returnRunningOne: id => update => {
            const query = {
                where: {
                    id: id
                },
                include: {
                    all: true
                }
            }
            return RunningTaxiDriver.findOne(query)
        },
        desocupedDriversList: object => update => new Promise((resolve, reject) => {

            const query = {
                running_taxi_id: parseInt(object.params.id)
            }
            DriverDelivery.findOne(query)
                .then(list => {
                    if (list) {
                        const mod = {
                            $set: {
                                ocuped: false,
                                accept: false
                            }
                        }
                        if (list.driver1 !== null && object.body.driver_id !== list.driver1) {
                            const query = {
                                driver_id: list.driver1
                            }
                            LastLocation.update(query, mod)
                                .then(resp => {
                                    //console.log(resp)
                                })
                                .catch(reject)
                        }
                        if (object.driver2 !== null && object.body.driver_id !== list.driver2) {
                            const query = {
                                driver_id: list.driver2
                            }
                            LastLocation.update(query, mod)
                                .then(resp => {
                                    //console.log(resp)
                                })
                                .catch(reject)
                        }
                        if (object.driver3 !== null && object.body.driver_id !== list.driver3) {
                            const query = {
                                driver_id: list.driver3
                            }
                            LastLocation.update(query, mod)
                                .then(resp => {
                                    //console.log(resp)
                                })
                                .catch(reject)
                        }
                        resolve()
                    } else {
                        resolve()
                        // reject({
                        //     title: 'Error',
                        //     message: 'Motorista não vinculado a esse pedido!'
                        // })
                    }
                })
                .catch(reject)
        }),
        ratesListOne: object => new Promise((resolve, reject) => {
            const query = {
                where: {
                    service_id: object.driver.service_id
                },
                raw: true
            }
            Rates.findOne(query)
                .then(rates => rates ? resolve(rates) : reject(isRates))
                .catch(reject)
        }),
        desocuped: object =>
            new Promise((resolve, reject) => {
                const query = {
                    where: {
                        $and: [{
                            id: object.driver_id
                        }, {
                            ocuped: true
                        }, {
                            active: true
                        }]
                    }
                }
                const mod = {
                    ocuped: false
                }
                LastLocation.update({
                    driver_id: object.driver_id
                }, {
                    $set: {
                        ocuped: false
                    }
                })
                    .then(mongodb => console.log(mongodb))
                    .catch(err => console.log(err))

                Driver.update(mod, query)
                    .then(object => resolve(validateUpdate(object)))
                    .catch(reject)
            }),
        driverToken: object => new Promise((resolve, reject) => {
            if (object.dataValues.driver_id != null) {
                const query = {
                    where: {
                        driver_id: object.dataValues.driver_id
                    },
                    raw: true
                }
                Devices.findOne(query)
                    .then(resolve)
                    .catch(reject)
            } else {
                resolve(object)
            }
        }),
        transactionListOne: object => new Promise((resolve, reject) => {
            const query = {
                where: {
                    $and: [
                        {
                            id: object.RequestDeliveries[0].dataValues.transaction_card_id
                        },
                        {
                            status: 'paid'
                        }
                    ]
                },
                raw: true
            }
            TransactionCard.findOne(query)
                .then(transaction => transaction ? resolve(transaction) : reject({
                    title: 'Transação',
                    message: 'Transação inexsitente!'
                }))
                .catch(reject)
        }),
        desocupedDriver: id => object => new Promise((resolve, reject) => {
            if (object.driver_id) {
                const query = {
                    driver_id: object.driver_id
                }
                const mod = {
                    $set: {
                        ocuped: false,
                        accept: false,
                        status: true
                    }
                }
                Driver.update({
                    ocuped: false,
                    accept: false,
                    status: true
                }, {
                    where: {
                        id: object.driver_id
                    }
                })
                    .then(driver => {
                        LastLocation.update(query, mod).exec()
                            .then(() => {
                                DriverDelivery.remove({running_taxi_id: id})
                                    .then((resp) => {
                                        resolve(object)
                                    })
                                    .catch(reject)
                            })
                            .catch(reject)
                    })
                    .catch(reject)
            } else {
                resolve(object)
            }
        }),
        desocupedDriverMysql: id => update => new Promise((resolve, reject) => Driver.update({
            ocuped: false,
            status: true,
            accept: false
        }, {
            where: {
                id: id
            }
        })
            .then(() => resolve(update))
            .catch(reject)),
        RunningTaxiCancel: id => object => new Promise((resolve, reject) => {
            console.log('estou aqui', id)
            const query = {
                where: {id: parseInt(id)}
            }
            const mod = {
                status: 9
            }
            RunningTaxiDriver.update(mod, query)
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
        blackList: object => {
            const query = {
                running_taxi_id: parseInt(object.params.id),
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
            return DriverDelivery.update(query, mod)
        },
        pushNotification: (id) => RunningTaxiDriver.findOne({
            where: {
                id: id
            },
            include: {
                all: true
            }
        }),
        cancelMongodb: object => update => new Promise((resolve, reject) => {
            const query = {
                driver_id: object.body.driver_id
            }
            const mod = {
                ocuped: false,
                accept: false
            }
            LastLocation.update(query, mod)
                .then(() => {
                    Driver.update({ocuped: false}, {
                        where: {
                            id: object.body.driver_id
                        }
                    })
                        .then(resp => console.log(resp))
                        .catch(reject)
                    resolve(object)
                })
                .catch(reject)
        }),

        blackListDriver: (id, body) => DriverDelivery.update({running_taxi_id: id}, {$set: {$push: {blackList: body.driver_id}}}),

        removeDriver: object => new Promise((resolve, reject) => {
            try {
                const query = {
                    running_taxi_id: parseInt(object.params.id),
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
                                    .then(update => resolve(object))
                                    .catch(reject)
                            }
                            if (driver.driver2 !== null && driver.driver2 === parseInt(object.body.driver_id)) {
                                const mod = {
                                    $set: {
                                        driver2: null
                                    }
                                }
                                DriverDelivery.update(query, mod)
                                    .then(update => resolve(object))
                                    .catch(reject)
                            }
                            if (driver.driver3 !== null && driver.driver3 === parseInt(object.body.driver_id)) {
                                const mod = {
                                    $set: {
                                        driver3: null
                                    }
                                }
                                DriverDelivery.update(query, mod)
                                    .then(update => resolve(object))
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
                    id: id,
                    status: 4
                }
            }
            const mod = {
                status: 3,
                driver_id: null
            }
            RunningTaxiDriver.update(mod, query)
                .then(object => resolve(validateUpdate(object)))
                .catch(reject)
        }),
        removeSearch: id => DriverDelivery.remove({
            running_taxi_id: id
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
            return RunningTaxiDriver.findOne(query)
        },
        searchRunningFinish: (id) => object => {
            const query = {
                where: {
                    id: parseInt(id)
                },
                include: [
                    {
                        model: RequestTaxiDriver,
                        include: [
                            {
                                model: TransactionCardCielo,
                                include: [
                                    {
                                        model: Card
                                    }
                                ]
                            },
                            {
                                model: PromoCode
                            }
                        ]
                    }
                ]
            }
            return RunningTaxiDriver.findOne(query)
        },
        tratmentCalculate: (body, object) => new Promise((resolve, reject) => {
            resolve({
                running_taxi_id: object.dataValues.id,
                rate_id: object.dataValues.RequestTaxiDrivers[0].dataValues.rate_id,
                cardDiscount: object.dataValues.cardDiscount,
                transaction_card_id: object.dataValues.RequestTaxiDrivers[0].dataValues.transaction_card_id,
                moneyDiscount: object.dataValues.moneyDiscount,
                cardMarchine: object.dataValues.cardMarchine,
                durationTime: object.dataValues.RequestTaxiDrivers[0].dataValues.durationTime,
                minBandeirada1: object.dataValues.RequestTaxiDrivers[0].dataValues.minBandeirada1,
                minBandeirada2: object.dataValues.RequestTaxiDrivers[0].dataValues.minBandeirada2,
                km: parseFloat(object.dataValues.RequestTaxiDrivers[0].dataValues.meters) / 1000,
                valueOld: object.dataValues.value,
                promocode: object.dataValues.RequestTaxiDrivers[0].PromoCode ? object.dataValues.RequestTaxiDrivers[0].PromoCode.dataValues : null,
                paymentId: object.dataValues.RequestTaxiDrivers[0].dataValues.TransactionCardCielo ? object.dataValues.RequestTaxiDrivers[0].dataValues.TransactionCardCielo.paymentId : null,
                cieloAmount: object.dataValues.RequestTaxiDrivers[0].dataValues.TransactionCardCielo ? object.dataValues.RequestTaxiDrivers[0].dataValues.TransactionCardCielo.amount : null,
                service_id: object.dataValues.service_id,
                newDistance: body.distance,
                finishDate: moment().format(),
                driver_id: body.driver_id,
                created_at: object.dataValues.progressTime,
                typePayment: object.dataValues.typePayment,
                newDurationTime: moment().diff(object.dataValues.progressTime, 'seconds')
            })
        }),

        refundCapture: object => new Promise((resolve, reject) => {
            try {
                if (object.pagarmeId) Pagarme.reversalTransaction({id: object.pagarmeId})
                if (object.dataValues) Pagarme.reversalTransaction({id: object.dataValues.RequestTaxiDrivers[0].TransactionCard.dataValues.pagarmeId})
                resolve(object)
            } catch (err) {
                resolve(object)
            }
        }),
        refundTransactionCielo: object => {
            if (object.paymentId) {
                return Cielo.trasnactionRefund({paymentId: object.paymentId, amount: object.cieloAmount})
            }
            if (object.dataValues) {
                return Cielo.trasnactionRefund({
                    paymentId: object.dataValues.RequestTaxiDrivers[0].TransactionCardCielo.dataValues.paymentId,
                    amount: object.dataValues.RequestTaxiDrivers[0].TransactionCardCielo.dataValues.amount
                })
            }
        },
        refundExtracDaily: object => new Promise(async (resolve, reject) => {
            if (object.dataValues.driver_id === null) {
                resolve(object)
            } else {
                let initDate = moment(new Date()).utcOffset(0).set({
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 1
                }).toISOString()
                let finishDate = moment(new Date()).utcOffset(0).set({
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 59
                }).toISOString()

                const count = await RunningTaxiDriver.count({
                    where: {
                        $and: [
                            {created_at: {$between: [initDate, finishDate]}},
                            {driver_id: object.dataValues.driver_id},
                            {service_id: object.dataValues.service_id},
                            {status: [6, 10]}
                        ]
                    }
                })

                if (count === 0) {
                    await ExtractDaily.destroy({
                        where: {
                            $and: [
                                {driver_id: object.dataValues.driver_id},
                                {date: moment().format('YYYY-MM-DD')},
                                {service_id: object.dataValues.service_id}
                            ]
                        }
                    })
                    resolve(object)
                }
                resolve(object)
            }
        }),
        ratesListOneTaxi: object => new Promise((resolve, reject) => {
            const query = {
                where: {
                    id: object.rate_id
                },
                raw: true
            }
            Rates.findOne(query)
                .then(rates => resolve(Object.assign({
                    rate: rates
                }, object)))
                .catch(reject)
        }),
        rulesPercent: object => new Promise((resolve, reject) => {
            const kmPercentLess = parseFloat(object.km - (object.km * 0.15)).toFixed(3)
            console.log('kmPercentLess', kmPercentLess)
            const kmPercentMore = parseFloat((object.km * 1.15)).toFixed(3)
            console.log('kmPercentMore', kmPercentMore)
            const timePercentLess = parseFloat((object.newDurationTime - (object.newDurationTime * 0.15))).toFixed(2)
            console.log(object.newDurationTime)
            console.log('timePercentLess', timePercentLess)
            const timePercentMore = parseFloat((object.newDurationTime * 1.15)).toFixed(2)
            console.log('timePercentMore', timePercentMore)

            if (object.newDistance >= kmPercentLess && object.newDistance <= kmPercentMore && object.newDurationTime >= timePercentLess && object.newDurationTime <= timePercentMore) {
                object.calculate = true
                object.newValue = object.valueOld
                delete object.rate
                resolve(object)

            } else {
                object.calculate = false
                resolve(object)
            }
        }),
        isBandeirada: object => new Promise((resolve, reject) => {
            const isDay = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']
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
            Holidays.findOne(query)
                .then(holidays => {
                    if (holidays || day === 'sábado' || day === 'domingo' || hour >= 22 || hour <= 5) {
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
        }),
        calculateTaxiTypePayment: object => new Promise((resolve, reject) => {
            console.log(object.calculate)
            if (!object.calculate) {
                try {
                    const bandeirada = (object.bandeirada2) ? parseFloat(object.rate.baseValue2) : parseFloat(object.rate.baseValue1)
                    // console.log('bandeirada', bandeirada)
                    const distanceValue = (object.bandeirada2) ? parseFloat(object.rate.valueKm2) : parseFloat(object.rate.valueKm1)
                    // console.log('distance', distanceValue)
                    const minBandeirada = (object.bandeirada2) ? parseFloat(object.rate.minBandeirada2) : parseFloat(object.rate.minBandeirada1)
                    // console.log('minBandeirada', distanceValue)
                    // console.log('franchiseMeters', parseFloat(object.rate.franchiseMeters / 1000))
                    const distance = parseFloat(object.newDistance) - (parseInt(object.rate.franchiseMeters / 1000)) < 0
                        ? 0.0
                        : (parseFloat(object.newDistance) - (parseInt(object.rate.franchiseMeters / 1000)) * parseFloat(distanceValue)).toFixed(2)

                    // console.log('tempo', parseFloat(object.newDurationTime) / 60)
                    const time = ((parseFloat(object.newDurationTime) / 60) * parseFloat(minBandeirada)).toFixed(2)

                    // console.log('valorTepo', time)

                    delete object.rate
                    object.newValue = (parseFloat(bandeirada) + parseFloat(distance) + parseFloat(time)).toFixed(2)
                    // console.log('valor sem desconto', object.newValue)
                    object.newValue = parseFloat(object.cardDiscount) === 0.0 ? parseFloat(object.newValue) : parseFloat(object.newValue) - (parseFloat(object.newValue) * (parseInt(object.cardDiscount) / 100))
                    if (object.promocode !== null) {
                        if (object.promocode.billingType === 2) {
                            ((object.newValue - parseFloat(object.promocode.value)).toFixed(2) < 0)
                                ? object.valueOld = 0.0
                                : ((parseFloat(object.newValue) - (parseFloat(object.newValue) * parseFloat(object.promocode.value).toFixed(2))) < 0)
                                ? object.newValue = 0.0
                                : object.newValue = (parseFloat(object.newValue) - (parseFloat(object.newValue) * parseFloat(object.promocode.value).toFixed(2)))
                        } else {
                            ((object.newValue - parseFloat(object.promocode.value)).toFixed(2) < 0)
                                ? object.newValue = 0.0
                                : object.newValue = (parseFloat(object.newValue) - parseFloat(object.promocode.value)).toFixed(2)
                        }
                    }
                    object.newValue = object.newValue > 0 ? object.newValue : 0.0
                    resolve(object)
                } catch (err) {
                    reject({title: 'Error', message: 'Error em calcular'})
                }
            } else {
                object.newValue = object.newValue > 0 ? object.newValue : 0.0
                resolve(object)
            }

        }),
        isPaymentType: object => new Promise((resolve, reject) => {
            if (object.typePayment === 2 && object.valueOld > 0) {
                RequestTaxiDriver.findOne({
                    where: {
                        running_taxi_driver_id: object.running_taxi_id
                    },
                    include: [
                        {
                            model: TransactionCardCielo
                        }
                    ]
                })
                    .then(request => resolve(Object.assign({request: request.dataValues}, object)))
                    .catch(reject)
            } else {
                resolve(object)
            }
        }),
        cardOne: object => new Promise((resolve, reject) => {
            if (object.request) {
                Card.findOne(
                    {
                        where: {
                            id: object.request.TransactionCardCielo.dataValues.card_id
                        },
                        include: [
                            {
                                model: User,
                                include: [{
                                    model: Address,
                                    include: [{
                                        model: City
                                    }, {
                                        model: State
                                    }, {
                                        model: Country
                                    }]
                                }],
                                attributes: ['name', 'ddd', 'ddi', 'number', 'email', 'cpf']
                            },
                            {
                                model: Company
                            }
                        ]
                    })
                    .then(card => resolve(Object.assign({
                        card: card
                    }, object)))
                    .catch(reject)
            } else {
                resolve(object)
            }
        }),
        pagarmeChange: object => {
            return Object.assign({
                pagarme: {
                    amount: (object.newValue && object.newDistance !== 0) ? Regex.clean((parseFloat(object.newValue) * 1.10).toString()) : Regex.clean((parseFloat(object.valueOld) * 1.10).toString()),
                    card_id: object.card.dataValues.cardId,
                    cvv: object.card.dataValues.cardCvv,
                    payment_method: 'credit_card',
                    postback_url: url.transactionCardFinishTaxi,
                    customer: {
                        name: object.card.dataValues.User.dataValues.name,
                        email: object.card.dataValues.User.dataValues.email,
                        document_number: object.card.dataValues.User.dataValues.cpf,
                        address: {
                            street: object.card.dataValues.User.dataValues.Addresses[0].address,
                            street_number: object.card.dataValues.User.dataValues.Addresses[0].number,
                            neighborhood: object.card.dataValues.User.dataValues.Addresses[0].district,
                            zipcode: object.card.dataValues.User.dataValues.Addresses[0].zipCode
                        },
                        phone: {
                            ddi: `+${object.card.dataValues.User.dataValues.ddi}`,
                            ddd: object.card.dataValues.User.dataValues.ddd.toString(),
                            number: object.card.dataValues.User.dataValues.number.toString()
                        }
                    },
                    metadata: {
                        running_taxi_id: object.running_taxi_id,
                        transaction_card_id_old: object.transaction_card_id,
                        attempt: 1,
                        user_id: object.card.dataValues.User.dataValues.id
                    }
                }
            }, object)
        },
        transactionCardCielo: object => {
            console.log('amount', parseFloat(object.newValue).toFixed(2))
            console.log('amount', parseFloat(object.newValue).toFixed(2) * 1.10)
            console.log('valueOld', parseFloat(object.valueOld))
            const amount =
                (object.newValue && object.newDistance !== 0)
                    ? Regex.clean((parseFloat(object.newValue) * 1.10).toFixed(2).toString())
                    : Regex.clean((parseFloat(object.valueOld) * 1.10).toFixed(2).toString())
            return Cielo.transactionCard({
                MerchantOrderId: object.running_taxi_id,
                Customer: {
                    Name: object.card.dataValues.User.dataValues.name
                },
                Payment: {
                    Type: 'CreditCard',
                    Amount: amount,
                    Installments: 1,
                    capture: true,
                    SoftDescriptor: object.running_taxi_id,
                    CreditCard: {
                        CardToken: object.card.dataValues.cardId,
                        SecurityCode: object.card.dataValues.cardCvv,
                        Brand: object.card.dataValues.brand === 'master-card' ? 'Master'
                            : object.card.dataValues.brand === 'maestro' ? 'Elo'
                                : object.card.dataValues.brand === 'diners-club' ? 'Diners' : object.card.dataValues.brand
                    }
                }
            })
        },
        pagarmeSend: object =>
            Pagarme.cardCredit(object.pagarme)
                .then(Help.returnPagarme)
                .then(transaction => Object.assign({transaction: transaction}, object)),

        createTransactionCielo: object => TransactionCardCielo.create(object),

        createTransaction: object => new Promise((resolve, reject) => {
            TransactionCard.create(Help.returnCardCreditTaxi(object))
                .then(() => resolve(object))
                .catch(reject)
        }),
        returnObject: object => new Promise(async (resolve, reject) => {
            const request = await RequestTaxiDriver.findOne({
                where: {running_taxi_driver_id: object.running_taxi_id},
                include: [{model: PromoCode}]
            })
            if (parseFloat(object.newValue) === 0.0 && request.dataValues.PromoCode) {
                resolve({
                    title: 'Finalizar',
                    message: 'Finalizado com Sucesso!',
                    cupom_name: request.dataValues.PromoCode.dataValues.name,
                    cupom_value: (request.dataValues.PromoCode.dataValues.typePayment == 1)
                        ? request.dataValues.PromoCode.dataValues.amount
                        : `${request.dataValues.PromoCode.dataValues.amount}%`,
                    original_value: request.dataValues.valuOldPromocode,
                    new_value: object.newValue,
                    start_time: moment(object.created_at).format('YYYY-MM-DD HH:MM:SS'),
                    end_time: moment(object.finishDate).format('YYYY-MM-DD HH:MM:SS')
                })
            } else if (request.dataValues.PromoCode) {
                resolve({
                    title: 'Finalizar',
                    message: 'Finalizado com Sucesso!',
                    cupom_name: request.dataValues.PromoCode.dataValues.name,
                    cupom_value: (request.dataValues.PromoCode.dataValues.typePayment == 1)
                        ? request.dataValues.PromoCode.dataValues.amount
                        : `${request.dataValues.PromoCode.dataValues.amount}%`,
                    original_value: request.dataValues.valuOldPromocode,
                    new_value: (request.dataValues.PromoCode.dataValues.typePayment == 1)
                        ? (parseFloat(object.newValue) - parseFloat(request.dataValues.PromoCode.dataValues.amount)).toFixed(2)
                        : ((parseFloat(request.dataValues.PromoCode.dataValues.amout) + 1) * parseFloat(object.newValue)).toFixed(2),
                    start_time: moment(object.created_at).format('YYYY-MM-DD HH:MM:SS'),
                    end_time: moment(object.finishDate).format('YYYY-MM-DD HH:MM:SS')
                })
            } else {
                resolve({
                    title: 'Finalizar',
                    message: 'Finalizado com Sucesso!',
                    new_value: object.newValue,
                    start_time: moment(object.created_at).format('YYYY-MM-DD HH:MM:SS'),
                    end_time: moment(object.finishDate).format('YYYY-MM-DD HH:MM:SS')
                })
            }
        }),
        updateRuning: (req, status, service) => object => new Promise((resolve, reject) => {
            const query = {
                where: {
                    id: parseInt(req.params.id)
                }
            }
            object.newValue = (parseInt(req.body.distance) !== 0.0) ? object.newValue : object.valueOld
            const mod = {
                status: status,
                value: object.newValue,
                percentCard: service === 2 ? parseFloat(object.newValue) * 0.10 : 0.0
            }
            RunningTaxiDriver.update(mod, query)
                .then(resp => {
                    console.log(resp)
                    resolve(object)
                })
                .catch(reject)
        }),
        verifyBothConfirmed: (eventEmitter, runningTaxiId) => {
            RunningTaxiDriver.findOne({
                where: {
                    id: runningTaxiId,
                    providerIdentityConfirmed: true,
                    userIdentityConfirmed: true
                }
            })
                .then(result => {
                    if (result) {
                        eventEmitter.emit('service-ride-both-identity-confirmed', result.dataValues)
                    }
                })
                .catch(err => {
                    console.log('verifyBothConfirmed error', err);
                })
        },
        onIdentityDenied: (eventEmitter, runningTaxiId, author) => {
            RunningTaxiDriver.findOne({where: {id: runningTaxiId}})
                .then(result => {
                    if (result) {
                        eventEmitter.emit('service-ride-identity-denied', result.dataValues)
                    }
                })
                .catch(err => {
                })
        },
        rowBackRunning: (req, status) => {
            const query = {
                where: {
                    $and: [{
                        id: parseInt(req.params.id)
                    },
                        {
                            driver_id: req.body.driver_id
                        }
                    ]
                }
            }
            const mod = {
                status: status
            }
            return RunningTaxiDriver.update(mod, query)
        },
        rowBackMongoLastLocation: req => update =>
            LastLocation.update({
                driver_id: req.body.driver_id
            }, {
                $set: {
                    accept: true,
                    status: false
                }
            })
    }
}
