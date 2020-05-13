module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')

    const Model = app.datasource.models.delivers
    const Persistence = require('../../helpers/persistence')(Model)

    // const Device = app.datasource.models.Devices
    // const Driver = app.datasource.models.Driver
    // const LastLocation = app.datasource.models.LastLocation
    // const Documents = app.datasource.models.Documents
    // const Company = app.datasource.models.Company
    // const Bank = app.datasource.models.Bank
    // const Card = app.datasource.models.Card
    // const Vehicles = app.datasource.models.Vehicles
    // const RunningDelivery = app.datasource.models.RunningDelivery
    // const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    // const {pushNotificationDrivers, pushNotificationUser} = require('../business/user')(app)
    // const Bussiness = require('../business/user')(app)
    // const crypto = require('../../helpers/crypto')
    // const Upload = require('../../helpers/aws-s3')
    // const Cpf = require('cpf_cnpj').CPF

    return {
        find: (req, res) => {
            const query = {
                where: {

                    //     name: {
                    //         $like: `%${req.body.name.toUpperCase()}%`
                    //     }
                },
                limit: 10
            }

            try {
                const filters = JSON.parse(req.query.filter)

                if (filters) {
                    query.where.$or = []
                    for (const key in filters) {
                        let tmp = {}
                        tmp[key] = {$like: `%${filters[key]}%`}
                        query.where.$or.push(tmp)
                    }
                }
            } catch (e) {}

            Model.findAll(query)
                .then(result => res.status(200).json({items: result, totalCount: result.length}))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },
        update: async (req, res) => {
            const query = {id: req.body.id}
            try {
                delete req.body._isEditMode
                delete req.body._userId
                delete req.body.id

                Persistence.update(query, req.body, res)
            } catch (err) {
                console.log(err)
                res.status(400).json(err)
            }
        },
        delete: (req, res) => {
            Persistence.delete(req.params, res)
        },
        create: (req, res) => {
            delete req.body._isEditMode
            delete req.body._userId

            Persistence.create(req.body, res)
        }

        // create: (req, res) => {
        //     Bussiness.create(req)
        //         .then(object => res.status(200).json(object))
        //         .catch(err => res.status(500).json(err))
        // },
        // createClient: async (req, res) => {
        //     const object = Bussiness.client(req)
        //     object.type_user_id = 1
        //     object.password = crypto.md5(req.body.password)
        //     object.cpf = req.body.cpf
        //     // Persistence.create(object, res)
        //
        //     const user = await User.create(object)
        //     const mod = {user_id: user.id, status: true}
        //     user.driver = await Driver.create(mod)
        //     await LastLocation.create({driver_id: user.driver.id})
        //     res.status(200).json(user)
        // },
        // createProvider: async (req, res) => {
        //     let userData = {body: req.body.user}
        //     let companyData = req.body.company
        //
        //     userData.body.is_provider = true
        //
        //     const object = Bussiness.client(userData)
        //     object.type_user_id = 1
        //     object.password = crypto.md5(userData.body.password)
        //     object.cpf = userData.body.cpf
        //
        //     app.datasource.sequelize.transaction(t => {
        //         return User.create(object, {transaction: t}).then(function (user) {
        //             return Driver.create({user_id: user.id, status: true}, {transaction: t}).then(function (driver) {
        //                 user.driver = driver
        //                 return LastLocation.create({driver_id: user.driver.id}, {transaction: t}).then(function (lastLocation) {
        //                     companyData.user_id = user.id
        //                     return Company.create(companyData, {transaction: t}).then(function (company) {
        //                         return res.status(200).json(user)
        //                     })
        //                 })
        //             })
        //         })
        //
        //     }).then(function (result) {
        //         // Transaction has been committed
        //         // result is whatever the result of the promise chain returned to the transaction callback
        //     }).catch(function (err) {
        //         // Transaction has been rolled back
        //         // err is whatever rejected the promise chain returned to the transaction callback
        //         res.status(500).json({message: err.errors[0].message})
        //     })
        // },
        // update: async (req, res) => {
        //     const query = req.params
        //     try {
        //         // if (req.file) {
        //         //     const s3 = await Upload.uploadAws(req.file)
        //         //     req.body.avatar = s3.Location
        //         //     req.body.keyUpload = req.file.filename
        //         // }
        //         // if (req.body.avatar) {
        //         //     const avatar = req.body.avatar
        //         //     await Upload.base64InArchiveUser(avatar, parseInt(req.params.id))
        //         //     const s3 = await Upload.uploadAwsBase64(avatar, parseInt(req.params.id))
        //         //     req.body.avatar = s3.Location
        //         //     req.body.keyUpload = s3.Key
        //         // }
        //         if (req.body.senha) req.body.senha = crypto.md5(req.body.senha)
        //
        //         // if (req.body.password1) req.body.password = crypto.md5(req.body.password1)
        //
        //         // if (req.body.password1) req.body.password = crypto.md5(req.body.password1)
        //
        //         // if (req.body.cpf) {
        //         //     if (!Cpf.isValid(req.body.cpf)) {
        //         //         return res.status(400).json([{title: 'Cpf', message: 'CPF inválido!'}])
        //         //     } else {
        //         //         req.body.stage = 7
        //         //         delete req.body.status
        //         //         Persistence.update(query, req.body, res)
        //         //     }
        //         // } else {
        //         //     req.body.stage = 7
        //         //     delete req.body.status
        //         Persistence.update(query, req.body, res)
        //         // }
        //
        //     } catch (err) {
        //         console.log(err)
        //         res.status(400).json(err)
        //     }
        // },
        // listOne: (req, res) => {
        //     const query = req.params
        //     Persistence.listOneWithJoin(query, res)
        // },
        // listAll: (req, res) => {
        //     let query = {}
        //     let driverQuery = {}
        //     if (req.query.name) query = Object.assign({name: {$like: '%' + req.query.name + '%'}}, query)
        //     if (req.query.cpf) query = Object.assign({cpf: req.query.cpf}, query)
        //     if (req.query.email) query = Object.assign({email: req.query.email}, query)
        //     if (req.query.active) driverQuery = Object.assign({active: req.query.active === 'true' ? true : false})
        //
        //     console.log(driverQuery)
        //     Persistence.listAllPaginated({
        //         where: query,
        //         order: [['id', 'DESC']],
        //         include: [
        //             {
        //                 model: Driver,
        //                 where: driverQuery,
        //                 required: true
        //             },
        //             {model: Company}, {model: Bank}, {model: Card}, {model: Documents}, {model: Vehicles}
        //         ],
        //         // include: {all: true}
        //     }, res)(req.query.page === 0 || req.query.page === 'undefined' ? 1 : req.query.page)
        // },
        //
        // delete: (req, res) => {
        //     const query = req.params
        //     Persistence.delete(query, res)
        // },
        //
        // updateAvatar: (req, res) => {
        //     const query = req.params
        //     const mod = {
        //         avatar: req.body.avatar
        //     }
        //     Persistence.update(query, mod, res)
        // },
        // blockUser: (req, res) => {
        //     const query = req.params
        //     const mod = {
        //         status: false
        //     }
        //     Persistence.update(query, mod, res)
        // },
        // forgot: (req, res) => {
        //     const query = {
        //         where: {
        //             email: {$eq: req.body.email}
        //         }
        //     }
        //     User.findOne(query).then(user => {
        //         const object = Bussiness.forgot(user)
        //         const mod = {
        //             forgot: object.forgot
        //         }
        //         const query = {
        //             email: req.body.email
        //         }
        //         Persistence.update(query, mod, res)
        //     })
        // },
        //
        // resend: (req, res) => {
        //     req.user.phone = `+${req.user.ddi}${req.user.ddd}${req.user.number}`
        //     const object = Bussiness.resend(req)
        //     Persistence.activeCode({id: req.params.id}, object, res)
        // },
        // forgotSend: (req, res) => {
        //     const query = {
        //         active: {
        //             $eq: req.body.active
        //         }
        //     }
        //     const mod = {
        //         password: crypto.md5(req.body.password),
        //         forgot: ''
        //     }
        //
        //     User.findOne(query).then(user => {
        //         user.password = req.body.password
        //         Bussiness.updatePassword(user)
        //     })
        //     Persistence.update(query, mod, res)
        // },
        // resendPhone: (req, res) => {
        //     req.user.phone = `+${req.user.ddi}${req.user.ddd}${req.user.number}`
        //     const query = {
        //         $and: [
        //             {id: req.user.id},
        //             {number: req.user.number},
        //             {ddi: req.user.ddi},
        //             {ddd: req.user.ddd}
        //         ]
        //     }
        //     const object = Bussiness.resend(req)
        //     Persistence.activeCode(query, object, res)
        // },
        // activeCode: async (req, res) => {
        //     try {
        //         const query = req.params
        //         const mod = {
        //             active: '',
        //             stage: 2,
        //             status: true
        //         }
        //         await Bussiness.active(req.params.active)
        //         Persistence.update(query, mod, res)
        //     } catch (err) {
        //         res.status(200).json(err)
        //     }
        // },
        // recoveAtiveCode: (req, res) => {
        //     const query = req.params
        //     const mod = {
        //         active: '',
        //         status: true
        //     }
        //     Bussiness.active(req.params.active)
        //         .then(() => Persistence.update(query, mod, res))
        //         .catch(err => res.status(200).json(err))
        // },
        // password: (req, res) => {
        //     const query = {
        //         forgot: {
        //             $eq: req.body.forgot
        //         }
        //     }
        //     const mod = {
        //         password: crypto.md5(req.body.password),
        //         forgot: ''
        //     }
        //
        //     User.findOne(query).then(user => {
        //         user.password = req.body.password
        //         Bussiness.updatePassword(user)
        //     })
        //     Persistence.update(query, mod, res)
        // },
        // typesVehicles: (req, res) => {
        //     if (req.body.type_vehicle_id === 3) {
        //         Bussiness.createBike(req.body)
        //             .then(() => {
        //                 const query = req.params
        //                 const mod = {
        //                     alias: req.body.alias,
        //                     stage: 4
        //                 }
        //                 Persistence.update(query, mod, res)
        //             })
        //             .catch(err => res.status(400).json(err))
        //     } else {
        //         const query = req.params
        //         const mod = {
        //             alias: req.body.alias,
        //             stage: 3
        //         }
        //         Persistence.update(query, mod, res)
        //
        //     }
        // },
        // completeRegister: (req, res) => {
        //     const query = {
        //         id: req.body.user_id
        //     }
        //     const mod = {
        //         password: crypto.md5(req.body.password),
        //         email: req.body.email1,
        //         birthday: moment(req.body.birthday).toISOString(),
        //         cpf: req.body.cpf,
        //         stage: 5
        //     }
        //     Persistence.update(query, mod, res)
        //     //Bussiness.completeRegister()
        //
        // },
        // searchUser: (req, res) => {
        //     if (req.body.isCpf === true) {
        //         const query = {
        //             where: {
        //                 cpf: req.body.cpf
        //             }
        //         }
        //         User.findOne(query)
        //             .then(user => res.status(200).json(user))
        //             .catch(err => res.status(500).json(err))
        //     } else {
        //         const query = {
        //             where: {
        //                 name: {
        //                     $like: `%${req.body.name.toUpperCase()}%`
        //                 }
        //             },
        //             limit: 4
        //         }
        //         User.findAll(query)
        //             .then(user => res.status(200).json(user))
        //             .catch(err => res.status(500).json(err))
        //     }
        // },
        // searchQuery: (req, res) => {
        //
        // },
        //
        // reportCreate: (req, res) => {
        //     let initDate = moment(req.body.initDate).utcOffset(-3).format('YYYY-MM-DD')
        //     let finishDate = moment(req.body.finishDate).utcOffset(-3).format('YYYY-MM-DD')
        //     console.log(`initDate ${initDate.toString()}`)
        //     console.log(`finishDate ${finishDate.toString()}`)
        //     User.sequelize.query(`SELECT COUNT(*) as TOTAL_DAY, DATE_FORMAT(created_at, '%Y-%m-%d') DAY FROM Users where created_at between DATE_FORMAT('${initDate.toString()}', '%Y-%m-%d') AND DATE_FORMAT('${finishDate.toString()}', '%Y-%m-%d') GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d') order by created_at desc;`)
        //         .then(resp => res.status(200).json(resp[0]))
        //         .catch(err => res.status(400).json(err))
        // },
        // isOpenRunning: async (req, res) => {
        //     try {
        //         const delivery = await RunningDelivery.find({
        //             where: {$and: [{user_id: req.user.object.id}, {status: [2, 3, 4, 5]}]},
        //             include: {all: true}
        //         })
        //         const particular = await RunningTaxiDriver.find({
        //             where: {$and: [{user_id: req.user.object.id}, {status: [2, 3, 4, 5]}]},
        //             include: {all: true}
        //         })
        //         res.status(200).json({
        //             delivery,
        //             particular
        //         })
        //     } catch (err) {
        //         res.status(500).json(err)
        //     }
        // },
        //
        // sendMensagge: async (req, res) => {
        //     try {
        //         if (parseInt(req.body.typeUser) === 1) {
        //             const users = await Device.findAll({
        //                 where: Device.sequelize.where(Device.sequelize.fn('LENGTH', Device.sequelize.col('tokenGcm')), {$gte: 10}),
        //                 attributes: ['tokenGcm'],
        //                 raw: true,
        //                 include: [{model: User, attributes: ['id'], required: true}]
        //             })
        //             users.map(async value => {
        //                 try {
        //                     await pushNotificationUser(req.body)(value)
        //                 } catch (err) {
        //                     console.log(err)
        //                 }
        //             })
        //             res.status(200).json({})
        //         } else {
        //             const drivers = await Device.findAll({
        //                 where: Device.sequelize.where(Device.sequelize.fn('LENGTH', Device.sequelize.col('tokenGcm')), {$gte: 10}),
        //                 attributes: ['tokenGcm'],
        //                 raw: true,
        //                 include: [{model: Driver, attributes: ['id'], required: true}]
        //             })
        //             drivers.map(async value => {
        //                 await pushNotificationDrivers(req.body)(value)
        //             })
        //             res.status(200).json({})
        //         }
        //     } catch (err) {
        //         console.log(err)
        //         res.status(400).json(err)
        //     }
        // },
        // sendEmail: (req, res) => {
        //     const user = Bussiness.sendEmailDocument(req.params)
        //     res.status(200).json(user)
        // },
        // channelQrCode: async (req, res) => {
        //     const canal = await Canais.findOne({where: {id: req.params.channel_id}})
        //     const resp = (await GoBOT.status(canal.instance_token, GoBOT.validateResponse))
        //     res.status(200).json(resp)
        // },
    }
}
