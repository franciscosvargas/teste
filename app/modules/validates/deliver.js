module.exports = app => {
    const TypeVehicles = app.datasource.models.TypeVehicles
    const User = app.datasource.models.delivers
    const Driver = app.datasource.models.Driver
    const Vehicles = app.datasource.models.Vehicles
    const Help = require('../../helpers/upload')
    const Aws = require('../../helpers/aws-s3')
    const Search = require('../../helpers/searchCpf')
    const Errors = require('../../errors/user/pt-br')
    const Regex = require('../../helpers/regex')
    const Cpf = require('cpf_cnpj').CPF

    return {
        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            //req.assert('login', Errors.email).isEmail()
            req.assert('phone', Errors.phone).notEmpty()
            req.assert('email', Errors.email).notEmpty()
            req.assert('email', Errors.login).isEmail()
            req.assert('password', Errors.password).notEmpty()
            const errors = req.validationErrors()

            errors ? res.status(400).json(errors) : next()
        },
        createClient: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            req.assert('login', Errors.email).isEmail()
            req.assert('phone', Errors.phone).notEmpty()
            req.assert('cpf', Errors.phone).optional()
            req.assert('password', Errors.password).len(6, 2000)
            const errors = req.validationErrors()
            if (errors) {
                res.status(400).json(errors)
            } else {
                // if (req.body.password1 !== req.body.password2) {
                //     res.status(400).json([Errors.samePassword])
                // } else if (req.body.cpf) {
                if (req.body.cpf) {
                    if (Cpf.isValid(req.body.cpf)) {
                        next()
                    } else {
                        res.status(400).json([Errors.cpfInvalid])
                    }
                } else {
                    next()
                }
            }
        },
        createProvider: (req, res, next) => {
            req.assert('user.name', Errors.name).notEmpty()
            req.assert('user.login', Errors.email).isEmail()
            req.assert('user.phone', Errors.phone).notEmpty()
            req.assert('user.cpf', Errors.phone).optional()
            req.assert('user.password', Errors.password).len(6, 2000)
            const errors = req.validationErrors()
            if (errors) {
                res.status(400).json(errors)
            } else {
                // if (req.body.password1 !== req.body.password2) {
                //     res.status(400).json([Errors.samePassword])
                // } else if (req.body.cpf) {
                if (req.body.user.cpf) {
                    if (Cpf.isValid(req.body.user.cpf)) {
                        next()
                    } else {
                        res.status(400).json([Errors.cpfInvalid])
                    }
                } else {
                    next()
                }
            }
        },
        listOne: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next(),

        reportCreate: (req, res, next) => {
            req.assert('initDate', Errors.initDate).notEmpty()
            req.assert('finishDate', Errors.finishDate).notEmpty()
            const errors = req.validationErrors()
            errors ? res.status(400).json(errors) : next()
        },
        statgeUser: (req, res, next) => {
            req.assert('email', Errors.email).isEmail()
            const errors = req.validationErrors()
            if (errors) {
                res.status(400).json(errors)
            } else {
                User.findOne({
                    where: {
                        $and: [
                            {login: {$eq: req.body.email}},
                            {first: true},
                            {stage: {$lte: 8}}
                        ]
                    },
                    include: [
                        {model: Driver, attributes: ['id']},
                        {model: Vehicles, attributes: ['plate']}
                    ],
                    attributes: ['stage', 'id', 'first', 'login', 'cpf', 'ddd', 'ddi', 'number']
                })
                    .then(user => res.status(200).json(user))
                    .catch(err => res.status(500).json(err))
            }
        },
        update: async (req, res, next) => {
            try {
                if (isNaN(req.params.id)) {
                    if (req.file) {
                        Help.uploadRemove(req.file.filename)
                    }
                    res.json([Errors.idInvalid])
                } else {
                    const query = {
                        where: {id: parseInt(req.params.id)},
                        raw: true
                    }
                    const user = await User.findOne(query)
                    if (user) {
                        if (req.file) {
                            if (user.avatar) await Aws.uploadAwsRemove(user.keyUpload)
                        }
                        next()
                    } else {
                        res.status(400).json([Errors.userExist])
                        Help.uploadRemove(req.body.file)
                    }
                }
            } catch (err) {
                res.status(400).json(err)
            }
        },
        delete: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next(),

        uniqueStage: (req, res, next) => {
            const phone = Regex.phoneClean(req.body.phone)
            const ddi = Regex.ddi(phone)
            const ddd = Regex.ddd(phone)
            const number = Regex.phone(phone)
            const query = {
                where: {
                    $or: [{
                        $and: [{
                            ddd: ddd
                        }, {
                            ddi: ddi
                        }, {
                            ddd: ddd
                        }, {
                            number: number
                        }]
                    },
                        {
                            login: {
                                $eq: req.body.email
                            }
                        }
                    ]
                },
                include: [
                    {model: Driver, attributes: ['id']},
                    {model: Vehicles, attributes: ['plate', 'type_vehicle_id']}
                ],
                attributes: ['stage', 'id', 'first', 'login', 'cpf', 'ddd', 'ddi', 'number']
            }
            User.findOne(query)
                .then(user => user ? res.status(400).json([{
                    error: Errors.userExist,
                    user: user
                }]) : next())
                .catch(err => res.status(500).json(err))
        },
        isAdmin: (req, res, next) => req.user.object.types_user_id === 2 ? next() : res.status(401).json([{
            title: 'Error',
            message: 'Usuário sem Permissão'
        }]),
        unique: (req, res, next) => {
            // const phone = Regex.phoneClean(req.body.phone)
            // const ddi = Regex.ddi(phone)
            // const ddd = Regex.ddd(phone)
            // const number = Regex.phone(phone)
            const query = {
                where: {
                    $or: [{
                        $and: [
                            // { ddd: ddd },
                            // { ddi: ddi },
                            // { ddd: ddd },
                            // { number: number }
                        ]
                    },
                        {
                            login: {
                                $eq: req.body.email
                            }
                        },
                        {
                            cpf: {
                                $eq: req.body.cpf
                            }
                        }
                    ]
                }
            }
            User.findOne(query)
                .then(user => user ? res.status(400).json([Errors.userExist]) : next())
                .catch(err => res.status(500).json(err))
        },
        uniqueProvider: (req, res, next) => {
            // const phone = Regex.phoneClean(req.body.phone)
            // const ddi = Regex.ddi(phone)
            // const ddd = Regex.ddd(phone)
            // const number = Regex.phone(phone)
            const query = {
                where: {
                    $or: [{
                        $and: [
                            // { ddd: ddd },
                            // { ddi: ddi },
                            // { ddd: ddd },
                            // { number: number }
                        ]
                    },
                        {
                            login: {
                                $eq: req.body.user.email
                            }
                        },
                        {
                            cpf: {
                                $eq: req.body.user.cpf
                            }
                        }
                    ]
                }
            }
            User.findOne(query)
                .then(user => user ? res.status(400).json([Errors.userExist]) : next())
                .catch(err => res.status(500).json(err))
        },
        forgot: (req, res, next) => {

            const { email } = req.body
            const query = {
                where: {
                    email: {
                        $eq: email.toLowerCase()
                    }
                }
            }
            User.findOne(query)
                .then(user => user ? next() : res.status(400).json([Errors.emailNotExist]))
                .catch(err => res.status(500).json(err))
        },
        forgotValidate: (req, res, next) => {
            const query = {
                where: {
                    forgot: {
                        $eq: req.body.forgot
                    }
                }
            }
            User.findOne(query)
                .then(user => user ? res.status(200).json({
                    token: true
                }) : res.status(400).json({
                    token: false
                }))
                .catch(err => res.status(500).json(err))
        },
        passwordSend: (req, res, next) => {
            req.assert('active', 'valid active required').len(6, 2000)
            req.assert('password1', 'valid password required').len(6, 2000)
            req.assert('password2', 'valid password required').len(6, 2000)
            const errors = req.validationErrors()
            if (errors) {
                res.status(400).json(errors)
            } else {
                const query = {
                    where: {
                        active: {
                            $eq: req.body.active
                        }
                    }
                }
                if (req.body.password1 === req.body.password2) {
                    User.findOne(query)
                        .then(user => user ? next() : res.status(400).json([{
                            title: 'Código',
                            message: 'Código inválido'
                        }]))
                        .catch(err => res.status(500).json(err))
                } else {
                    res.status(400).json({
                        error: 'Passwords must be the same'
                    })
                }
            }

        },
        password: (req, res, next) => {
            req.assert('forgot', 'valid forgot required').notEmpty()
            req.assert('password1', 'valid password required').len(6, 2000)
            req.assert('password2', 'valid password required').len(6, 2000)
            const errors = req.validationErrors()

            if (errors) {
                res.status(400).json(errors)
            } else {
                const query = {
                    where: {
                        forgot: {
                            $eq: req.body.forgot
                        }
                    }
                }
                if (req.body.password1 === req.body.password2) {
                    console.log(req.body)
                    User.findOne(query)
                        .then(user => user ? next() : res.status(400).json({
                            error: 'Token invalid!'
                        }))
                        .catch(err => res.status(500).json(err))
                } else {
                    res.status(400).json({
                        error: 'Passwords must be the same'
                    })
                }
            }
        },
        resendPhone: (req, res, next) => {
            req.assert('phone', Errors.phone).notEmpty()
            const errors = req.validationErrors()
            if (errors) {
                res.status(400).json(errors)
            } else {
                console.log(req.bo)
                const phone = Regex.phoneClean(req.body.phone)
                req.body.ddi = Regex.ddi(phone)
                req.body.ddd = Regex.ddd(phone)
                req.body.number = Regex.phone(phone)
                User.findOne({
                    where: {
                        $and: [
                            {ddi: req.body.ddi},
                            {ddd: req.body.ddd},
                            {number: req.body.number}
                        ]
                    }
                })
                    .then(user => {
                        if (user) {
                            req.user = user.dataValues
                            next()
                        } else {
                            res.status(400).json([Errors.userNotExist])
                        }
                    })
                    .catch(err => res.status(500).json(err))
            }
        },
        resend: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                User.findById(req.params.id)
                    .then(user => {
                        if (user) {
                            req.user = user.dataValues
                            next()
                        } else {
                            res.status(400).json([Errors.userNotExist])
                        }
                    })
                    .catch(err => res.status(400).json(err))
            }
        },
        activeCode: (req, res, next) => {
            const active = parseInt(req.params.active)
            if (isNaN(active)) {
                res.status(400).json([Errors.activeInvalid])
            } else {
                const query = {
                    where: {
                        active: {
                            $eq: active
                        }
                    }
                }
                User.findOne(query)
                    .then(user => user ? next() : res.status(400).json([Errors.activeInvalid]))
                    .catch(err => res.status(500).json(err))
            }
        },
        generatePlateVehicle: (req, res, next) => {
            if (req.body.type_vehicle_id == 3) {
                req.body.plate = `iuvo_club-${req.params.id}`
                req.body.situation = 'Sem restrição'
                req.body.model = 'Bicicleta'
                req.body.brand = 'Indefinido'
                req.body.brandYear = '2017'
                req.body.color = 'Indefinido'
                req.body.uf = 'Indefinido'
                req.body.city = 'Indefinido'
                req.body.chassi = `iuvo_club-${req.params.id}`
                req.body.user_id = req.params.id
                req.body.type_vehicle_id = req.body.type_vehicle_id
                next()
            } else {
                next()
            }
        },
        isStageUser: stage => (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.json([Errors.idInvalid])
            } else {
                User.findOne({
                    where: {
                        $and: [
                            {id: req.params.id},
                            {stage: stage}
                        ]
                    }
                })
                    .then(user => !user ? next() : res.status(400).json([{
                        title: 'Error',
                        message: 'Essa parte já foi cadastrada!'
                    }]))
                    .catch(err => res.status(500).json(err))
            }
        },
        typesVehicles: (req, res, next) => {
            req.assert('alias', Errors.alias).notEmpty()
            req.assert('type_vehicle_id', Errors.type_vehicle_id).isInt()
            const errors = req.validationErrors()
            if (isNaN(req.params.id)) {
                res.json([Errors.idInvalid])
            } else {
                if (errors) {
                    res.status(400).json(errors)
                } else {
                    TypeVehicles.findById(req.body.type_vehicle_id)
                        .then(type => !type ? res.status(400).json([Errors.typeVehiclesNotExist]) : next())
                        .catch(err => res.status(500).json(err))
                }
            }
        },
        completeRegister: (req, res, next) => {
            req.assert('email1', Errors.email1).isEmail()
            req.assert('cpf', Errors.cpf).notEmpty()
            req.assert('birthday', Errors.birthday).notEmpty()
            req.assert('password1', Errors.password1).notEmpty()
            req.assert('password2', Errors.password2).notEmpty()
            req.assert('user_id', Errors.userId).notEmpty()
            const errors = req.validationErrors()
            if (errors) {
                res.status(400).json(errors)
            } else {
                const query = {
                    where: {
                        cpf: req.body.cpf
                    }
                }
                User.findOne(query)
                    .then(user =>
                        user ? res.status(400).json([Errors.cpfExist])
                            : (req.body.password1 !== req.body.password2) ? res.status(400).json([Errors.samePassword]) : next()
                    )
                    .catch(err => res.status(500).json(err))
            }
        },
        searchCpf: (req, res, next) => {
            req.assert('user_id', Errors.userId).notEmpty()
            req.assert('birthdate', Errors.birthday).notEmpty()
            req.assert('cpf', Errors.cpf).notEmpty()
            const errors = req.validationErrors()
            if (Cpf.isValid(req.body.cpf)) {
                if (errors) {
                    res.status(400).json(errors)
                } else {
                    User.findById(req.body.user_id)
                        .then(user => {
                            if (user) {
                                Search.searchCpf(user.dataValues, req.body, res)
                            } else {
                                res.status(400).json([Errors.userNotExist])
                            }
                        })
                }
            } else {
                res.status(400).json([Errors.cpfInvalid])
            }
        },
        searchUser: (req, res, next) => {
            req.assert('name', Errors.name).optional()
            req.assert('cpf', Errors.cpf).optional()
            req.assert('isCpf', Errors.validateCpf).isBoolean()
            const errors = req.validationErrors()
            if (errors) {
                res.status(400).json(errors)
            } else {
                if (req.body.isCpf === 'true') {
                    Cpf.isValid(req.body.cpf) ? next() : res.status(400).json(Errors.cpfInvalid)
                } else {
                    next()
                }
            }
        },
        email: (req, res, next) => {
            const query = {
                where: {
                    login: {
                        $eq: req.params.email
                    }
                }
            }
            User.findOne(query)
                .then(user => !user ? res.status(200).json({
                    validate: true
                }) : res.status(400).json([{
                    title: 'Error',
                    message: 'Email já existente!'
                }]))
                .catch(err => res.status(500).json(err))
        },
        phone: (req, res, next) => {
            const phone = Regex.phoneClean(req.params.phone)
            const ddi = Regex.ddi(phone)
            const ddd = Regex.ddd(phone)
            const number = Regex.phone(phone)
            const query = {
                where: {
                    $and: [{
                        ddi: ddi
                    }, {
                        ddd: ddd
                    }, {
                        number: number
                    }]
                }
            }
            //console.log(query.where)
            User.findOne(query)
                .then(user => !user ? res.status(200).json({
                    validate: true
                }) : res.status(400).json({
                    title: 'Error',
                    message: 'Phone já existente!'
                }))
                .catch(err => res.status(500).json(err))
        },
        cpf: (req, res, next) => {
            const query = {
                where: {
                    cpf: {
                        $eq: req.params.cpf
                    }
                }
            }
            User.findOne(query)
                .then(user => !user ? res.status(200).json({
                    validate: true
                }) : res.status(400).json([{
                    title: 'Error',
                    message: 'Cpf já existente!'
                }]))
                .catch(err => res.status(500).json(err))
        }
    }
}
