module.exports = app => {
    const TransactionDeposit = app.datasource.models.TransactionDeposit

    const Company = app.datasource.models.Company
    const Help = require('../../helpers/upload')
    const Errors = require('../../errors/transactionDeposit/pt-br')

    return {
        create: (req, res, next) => {
            req.assert('agency', Errors.agency).notEmpty()
            req.assert('agencyDv', Errors.agencyDv).notEmpty()
            req.assert('account', Errors.account).notEmpty()
            req.assert('accountDv', Errors.accountDv).optional()
            req.assert('value', Errors.value).isFloat()
            req.assert('company_id', Errors.companyId).notEmpty()
            req.assert('type_transaction_id', Errors.transactionType).isInt()
            const error = req.validationErrors()

            if (error) {
                if (req.file) {
                    Help.uploadRemove(req.file.filename)
                }
                res.status(400).json(error)
            } else {
                if (!req.file) {
                    res.status(400).json([Errors.receipt])
                } else {
                    Company.findById(req.body.company_id)
                        .then(company => {
                            if (company) {
                                next()
                            } else {
                                if (req.file) {
                                    Help.uploadRemove(req.file.filename)
                                }
                                res.status(400).json(Errors.companyNotExist)
                            }
                        })
                        .catch(err => res.status(500).json(err))
                }
            }
        },

        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                req.assert('agency', Errors.agency).optional()
                req.assert('agencyDv', Errors.agencyDv).optional()
                req.assert('account', Errors.account).optional()
                req.assert('accountDv', Errors.accountDv).optional()
                req.assert('value', Errors.value).optional()
                req.assert('company_id', Errors.companyId).optional()
                const error = req.validationErrors()
                if (error) {
                    res.status(400).json(error)
                } else {
                    TransactionDeposit.findById(req.params.id)
                        .then(deposit => {
                            if (deposit) {
                                if (req.file) {
                                    if (deposit.receipt) Help.uploadRemove(deposit.receipt)
                                }
                                next()
                            } else {
                                res.status([Errors.depositNotExist])
                            }
                        })
                }
            }
        },

        validate: (req, res, next) => {
            setTimeout(() => {
                if (isNaN(req.params.id)) {
                    res.status(400).json([Errors.idInvalid])
                } else {
                    TransactionDeposit.findOne({
                        where: {$and: [{id: parseInt(req.params.id)}, {status: false}]},
                        raw: true
                    })
                        .then(transactionDeposit => {
                            if (transactionDeposit) {
                                req.transactionDeposit = transactionDeposit
                                next()
                            } else {
                                res.status(400).json([Errors.depositNotExist])
                            }
                        })
                }
            }, 1000)
        },
        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
    }
}
