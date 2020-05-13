module.exports = app => {
    const User = app.datasource.models.User
    const Company = app.datasource.models.Company
    const Errors = require('../../errors/card/pt-br')
    const validateCard = require('card-validator')
    return {
        create: (req, res, next) => {
            req.assert('cardNumber', Errors.cardNumber).notEmpty()
            req.assert('cardExpirationDate', Errors.cardExpirationDate).notEmpty()
            req.assert('cardCvv', Errors.cardCvv).notEmpty()
            req.assert('cardHolderName', Errors.cardHolderName).notEmpty()
            req.assert('user_id', Errors.useId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                !validateCard.number(req.body.cardNumber).isValid
                    ? res.status(400).json([Errors.cardNumberValid])
                    : User.findById(req.body.user_id)
                        .then(user => user ? next() : res.status(400).json([Errors.userNotExist]))
                        .catch(err => res.status(500).json(err))
            }
        },

        company: (req, res, next) => {
            req.assert('cardNumber', Errors.cardNumber).notEmpty()
            req.assert('cardExpirationDate', Errors.cardExpirationDate).notEmpty()
            req.assert('cardCvv', Errors.cardCvv).notEmpty()
            req.assert('cardHolderName', Errors.cardHolderName).notEmpty()
            req.assert('company_id', Errors.companyId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Company.findById(req.body.company_id)
                    .then(company => company ? next() : res.status(400).json([Errors.companyNotExist]))
                    .catch(err => res.status(500).json(err))
            }
        },

        listUser: (req, res, next) => isNaN(req.params.user_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        listOneCompany: (req, res, next) => isNaN(req.params.company_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
    }
}
