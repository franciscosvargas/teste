module.exports = app => {
    const Errors = require('../../errors/bank/pt-br')
    const User = app.datasource.models.User
    const TypesBank = app.datasource.models.TypesBank
    const Bank = app.datasource.models.Bank
    const Cpf = require('cpf_cnpj').CPF

    return {
        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty().len(4, 100)
            req.assert('my', Errors.my).notEmpty()
            req.assert('agency', Errors.agency).notEmpty()
            req.assert('agencyDv', Errors.agencyDv).optional()
            req.assert('account', Errors.account).notEmpty()
            req.assert('accountDv', Errors.accountDv).notEmpty()
            req.assert('user_id', Errors.userId).notEmpty()
            req.assert('operation', Errors.operation).optional()
            req.assert('types_bank_id', Errors.typesBankId).notEmpty()

            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                TypesBank.findById(req.body.types_bank_id)
                    .then(typeBank => {
                        if (!typeBank) {
                            res.status(400).json([Errors.typeBankNotExist])
                        } else {
                            User.findById(req.body.user_id)
                                .then(user => {
                                    if (!user) {
                                        res.status(400).json([Errors.userNotExist])
                                    } else {
                                        req.typeBank = typeBank
                                        next()
                                    }
                                })
                        }
                    })
                    .catch(err => res.status(500).json(err))
            }
        },
        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        listOneUser: (req, res, next) => {
            isNaN(req.params.user_id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        update: (req, res, next) => {
            console.log('estou no update', req.body)
            if (isNaN(req.params.id || req.params.user_id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                req.assert('name', Errors.name).notEmpty().len(4, 100)
                req.assert('my', Errors.my).notEmpty()
                req.assert('agency', Errors.agency).notEmpty()
                req.assert('agencyDv', Errors.agencyDv).optional()
                req.assert('account', Errors.account).notEmpty()
                req.assert('accountDv', Errors.accountDv).notEmpty()
                req.assert('user_id', Errors.userId).notEmpty()
                req.assert('operation', Errors.operation).optional()
                req.assert('types_bank_id', Errors.typesBankId).notEmpty()
                const error = req.validationErrors()
                if (error) {
                    res.status(400).json(error)
                } else {
                    TypesBank.findById(req.body.types_bank_id)
                        .then(typeBank => {
                            if (!typeBank) {
                                res.status(400).json([Errors.typeBankNotExist])
                            } else {
                                User.findById(req.body.user_id)
                                    .then(user => {
                                        if (!user) {
                                            res.status(400).json([Errors.userNotExist])
                                        } else {
                                            req.typeBank = typeBank
                                            !Cpf.isValid(req.body.cpf)
                                                ? res.status(400).json([Errors.cpfInvalid])
                                                : next()
                                        }
                                    })
                            }
                        })
                        .catch(err => res.status(500).json(err))
                }
            }
        },
        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        unique: (req, res, next) => {
            const query = {
                where: {
                    $or: [{user_id: req.body.user_id}, {cpf: req.body.cpf}]
                }
            }
            Bank.findOne(query)
                .then(bank => bank ? res.status(400).json([Errors.bankExist]) : next())
                .catch(err => res.status(500).json(err))
        }

    }
}
