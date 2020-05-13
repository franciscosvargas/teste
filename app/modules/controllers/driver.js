module.exports = app => {
    const Driver = app.datasource.models.Driver
    const User = app.datasource.models.User
    const Vehicles = app.datasource.models.Vehicles
    const Score = app.datasource.models.Score
    const Rates = app.datasource.models.Rates
    const BlockDriver = app.datasource.models.BlockDriver
    const Service = app.datasource.models.Services
    const Scores = app.datasource.models.Score
    const Documents = app.datasource.models.Documents
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const RequestDelivery = app.datasource.models.RequestDelivery
    const RequestTaxiDriver = app.datasource.models.RequestTaxiDriver
    const Company = app.datasource.models.Company
    const Persistence = require('../../helpers/persistence')(Driver)
    const Firebase = require('../../helpers/firebase')
    const DriverBusiness = require('../business/driver')(app)
    const Business = require('../business/runningDelivery')(app)
    const LastLocation = app.datasource.models.LastLocation
    const LastLocate = require('../business/lastLocation')(app)

    const LogDriver = require('../business/logDriver')(app)

    const moment = require('moment')

    return {
        update: async (req, res) => {
            const query = req.params
            req.body.updated_at = moment()
            const last = await LastLocate.driverOne(req.params.id)
            await Business.lastLocationUpdate(req)(last)
            Persistence.update(query, req.body, res)
        },
        reset: async (req, res) => {
            try {
                const driver = await Driver.findOne({where: {id: parseInt(req.params.id)}, raw: true})
                await Documents.destroy({where: {user_id: driver.user_id}})
                await User.update({avatar: null, stage: 6}, {where: {id: driver.user_id}})
                res.status(200).json([{
                    title: 'Alterado com sucesso!',
                    message: 'Conseguimos alterar o seu registro com sucesso!'
                }])
            } catch (err) {
                console.log(err)
                res.status(500).json(err)
            }
        },
        updatePost: (req, res) => {
            const query = {id: req.body.driver_id}
            const mod = req.body
            Persistence.update(query, mod, res)
        },
        listOne: (req, res) => {
            const query = req.params
            Persistence.listOne(query, res)
        },
        runningTest: (req, res) =>
            Business.pushNotification(1)
                .then(Business.tratmentPushNotificationTest)
                .then(Business.deviceListTesst(req.params.id))
                .then(Business.pushNotificationTest)
                .then(resp => res.status(200).json(resp))
                .catch(err => res.status(500).json(err)),

        listAllFilter: (req, res) => {
            let query = {}
            let include = []
            if (parseInt(req.body.service_id) !== 0) query = Object.assign({service_id: parseInt(req.body.service_id)}, query)
            req.body.name ? include.push({
                model: User,
                where: {name: {$like: `%${req.body.name}%`}},
                required: true
            }) : include.push({model: User})
            if (parseInt(req.body.status) === 0) include.push({model: BlockDriver})
            if (parseInt(req.body.status) === 1) include.push({model: BlockDriver, required: true})
            if (parseInt(req.body.status) === 2) include.push({model: BlockDriver})

            include.push({model: Vehicles}, {model: Scores}, {model: Service})

            query = {
                where: query,
                include: include
            }
            Persistence.listAllPaginated(query, res)(req.query.page)
        },

        listOneDriverFilter: (req, res) => {
            Persistence.listAllQuery({
                where: {service_id: 1},
                attributes: ['id'],
                include: [
                    {
                        model: User,
                        attributes: ['name', 'ddd', 'ddi', 'number', 'email', 'status'],
                        where: {name: {$like: '%' + req.body.name + '%'}},
                        required: true
                    }
                ]
            }, res)
        },
        listAll: (req, res) => {
            Persistence.listAllPaginated({
                where: {},
                include: [
                    {
                        model: User,
                        attributes: ['name', 'avatar'],
                        where: {stage: {$gt: 4}},
                        include: [{
                            model: Vehicles,
                            required: true,
                            attributes: ['model', 'plate']
                        }]
                    },
                    {
                        model: BlockDriver,
                        attributes: ['description', 'created_at', 'id', 'driver_id']
                    },
                    {
                        model: Service,
                        required: true,
                        attributes: ['name']
                    }
                ]
            }, res)(req.query.page)
        },
        listAllDriversByCompany: async (req, res) => {
            try {
                const drivers = await Business.countRunningDrivers(req)
                Persistence.listAllPaginated({
                    where: {
                        id: drivers
                    },
                    distinct: true,
                    include: [
                        {
                            model: User,
                            attributes: ['name', 'avatar'],
                            include: [{
                                model: Vehicles,
                                required: true,
                                attributes: ['model', 'plate'],
                                group: ['driver_id']
                            }]
                        },
                        {
                            model: BlockDriver,
                            attributes: ['description', 'created_at', 'id', 'driver_id'],
                            group: ['driver_id']
                        },
                        {
                            model: Service,
                            required: true,
                            attributes: ['name'],
                            group: ['driver_id']
                        },
                        {
                            model: RunningDelivery,
                            required: true,
                            where: {company_id: req.params.company_id},
                            group: ['driver_id']
                        }
                    ]
                }, res)(req.query.page)
            } catch (err) {
                console.log('estou aqui', err)
                res.status(500).json(err)
            }
        },

        listOneDriver: (req, res) => {
            const query = {
                where: {
                    id: parseInt(req.params.id)
                },
                include: [{
                    model: User,
                    attributes: {
                        exclude: ['password', 'created_at', 'updated_at', 'master', 'token', 'forgot', 'active']
                    }
                },
                    {
                        model: Vehicles
                    },
                    {
                        model: Score,
                        attributes: [
                            [Score.sequelize.fn('AVG', Score.sequelize.col('star')), 'star']
                        ]
                    }
                ]
            }

            Driver.findOne(query)
                .then(resp => res.status(200).json(resp))
                .catch(err => console.log(err))
        },
        setStatus: async (req, res) => {
            await LastLocation.update({driver_id: parseInt(req.params.id)}, {$set: {status: req.body.status}})
            await LogDriver.create({
                driver_id: req.params.id,
                status: req.body.status,
                description: 'Motorista Alterou seu Status'
            })
            Persistence.update(req.params, req.body, res)
        },
        pushNotification: (req, res) => {
            Business.pushNotification(req.params.id)
                .then(object => {
                    const objectToken = {
                        data: {
                            title: 'Nova Corrida',
                            message: {
                                running: Business.tratmentPushNotification(object.dataValues)
                            }
                        },
                        token: req.body.token
                    }
                    Firebase.pushNotification(objectToken, Firebase.validateResponse)
                        .then(response => res.status(200).json(response))
                        .catch(err => res.status(500).json(err))
                })
                .catch(err => res.status(500).json(err))
        },
        pushNotificationTaxi: (req, res) => {
            Business.pushNotificationTaxi(req.params.id)
                .then(object => {
                    const objectToken = {
                        data: {
                            title: 'Nova Corrida',
                            message: {
                                running: Business.tratmentPushNotificationTaxi(object.dataValues)
                            }
                        },
                        token: req.body.token
                    }
                    Firebase.pushNotification(objectToken, Firebase.validateResponse)
                        .then(response => res.status(200).json(response))
                        .catch(err => res.status(500).json(err))
                }).catch(err => res.status(500).json(err))
        },
        active: async (req, res) => {
            try {
                const query = req.params
                const latLocation = await LastLocate.driverOne(req.params.id)
                const business = await Business.lastLocationUpdateActive(req)(latLocation)
                await Business.createDevice(business)
                Persistence.update(query, req.body, res)
            } catch (err) {
                res.status(500).json(err)
            }
        },
        listOnlineAll: async (req, res) => {
            try {
                const drivers = await LastLocate.driverOnline(req.body)
                res.status(200).json(drivers)
            } catch (err) {
                res.status(400).json(err)
            }
            // LastLocate.driverOnline(req.body)
            //     .then(LastLocate.listDriver)
            //     .then(LastLocate.isOnline)
            //     .then(drivers => res.status(200).json(drivers))
            //     .catch(err => res.status(400).json(err))
        },
        unlock: (req, res) => {
            LastLocation.update({driver_id: parseInt(req.body.driver_id)}, {
                $set: {
                    ocuped: false,
                    status: true,
                    accept: false,
                    active: true,
                    block: false
                }
            })
                .then(resp => res.status(200).json([{title: 'Alterado', message: 'Alterado com sucesso!'}]))
                .catch(err => res.status(500).json(err))
        },

        listRaceLine: async (req, res) => {
            try {
                const {city_id, state_id, country_id} = req.user.object.Addresses[0]
                const delivery = await RunningDelivery.findAll({
                    where: {
                        $and: [
                            {status: [2, 3]},
                            {driver_id: null}
                        ]
                    },
                    limit: 10,
                    include: [
                        {
                            model: Company,
                            attributes: ['fantasy', 'socialName']
                        }, {
                            model: User,
                            attributes: ['name']
                        }, {
                            model: RequestDelivery,
                            attributes: ['originAddresses'],
                            include: [
                                {
                                    model: Rates,
                                    attributes: [],
                                    where: {city_id: city_id, state_id: state_id, country_id: country_id},
                                    required: true
                                }
                            ]
                        }
                    ]
                })
                const taxi = await RunningTaxiDriver.findAll({
                    where: {
                        $and: [
                            {status: [2, 3]},
                            {driver_id: null}
                        ]
                    },
                    limit: 10,
                    include: [
                        {
                            model: Company,
                            attributes: ['fantasy', 'socialName']
                        }, {
                            model: User,
                            attributes: ['name']
                        },
                        {
                            model: RequestTaxiDriver,
                            attributes: ['originAddresses'],
                            include: [
                                {
                                    model: Rates,
                                    attributes: [],
                                    where: {city_id: city_id, state_id: state_id, country_id: country_id},
                                    required: true
                                }
                            ]
                        }
                    ]
                })
                res.status(200).json({delivery, taxi})
            } catch (err) {
                res.status(400).json(err)
            }
        },
        historicRunning: async (req, res) => {
            try {
                let initDate = moment(req.body.init).utcOffset(-3).set({
                    hour: 0,
                    minute: 0,
                    second: 0,
                    millisecond: 1
                }).toISOString()
                let finishDate = moment(req.body.finish).utcOffset(-3).set({
                    hour: 23,
                    minute: 59,
                    second: 59,
                    millisecond: 59
                }).toISOString()
                const delivery = await RunningDelivery.findAll({
                    where: {
                        $and: [
                            {created_at: {$between: [initDate, finishDate]}},
                            {service_id: req.body.service_id},
                            {driver_id: parseInt(req.params.id)},
                            {status: [6, 10]}
                        ]
                    },
                    attributes: ['created_at', 'value'],
                    include: [
                        {
                            model: Company,
                            attributes: ['fantasy', 'socialName']
                        }, {
                            model: User,
                            attributes: ['name']
                        }, {
                            model: RequestDelivery,
                            attributes: ['originAddresses', 'destinationAddresses']
                        }
                    ]
                })
                const taxi = await RunningTaxiDriver.findAll({
                    where: {
                        $and: [
                            {created_at: {$between: [initDate, finishDate]}},
                            {service_id: req.body.service_id},
                            {driver_id: req.params.id},
                            {status: [6, 10]}
                        ]
                    },
                    attributes: ['created_at', 'value'],
                    include: [
                        {
                            model: User,
                            attributes: ['name']
                        }, {
                            model: RequestTaxiDriver,
                            attributes: ['originAddresses', 'destinationAddresses']
                        }
                    ]
                })
                res.status(200).json([
                    {
                        delivery: delivery
                    }, {
                        particular: taxi
                    }
                ])
            } catch (err) {
                res.status(500).json(err)
            }
        },
        unlockCompany: (req, res) => {
            DriverBusiness.RunningDeliveryListOneOpen(req.params.id)
                .then(DriverBusiness.balanceReturn)
                .then(DriverBusiness.RunningDeliveryUpdate)
                .then(DriverBusiness.logProblemRunning(req.user.object, req.body.description))
                .then(DriverBusiness.lastLocationUpdate)
                .then(() => res.status(200).json({
                    title: 'Alterado com sucesso!',
                    message: 'Conseguimos alterar o seu registro com sucesso!'
                }))
                .catch(err => res.status(500).json([err]))
        },
        setup: (req, res) => {
            Driver.update(req.body, {where: {id: parseInt(req.params.id)}})
                .then(resp => res.status(200).json([{title: 'Alterado', message: 'Alterado com sucesso!'}]))
                .catch(err => res.status(500).json(err))
        }
    }
}
