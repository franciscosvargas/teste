module.exports = app => {
    const PaymentType = app.datasource.models.PaymentType

    const Errors = require('../../errors/paymentType/pt-br')

    return {

        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },

        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },

        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.json([Errors.idInvalid])
            } else {
                req.assert('name', Errors.percent).optional()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },

        unique: (req, res, next) => {
            const query = { where: {percent: req.body.percent} }
            PaymentType.findOne(query)
                .then(paymentType => paymentType ? res.status(400).json([Errors.paymentTypeNotExist]) : next())
                .catch(err => res.status(500).json(err))
        },

        delete: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next()

    }
}
