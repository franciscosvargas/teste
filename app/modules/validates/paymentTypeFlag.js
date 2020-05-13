module.exports = app => {
    const PaymentType = app.datasource.models.PaymentType

    const Errors = require('../../errors/paymentTypeFlag/pt-br')

    return {
        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            req.assert('payment_type_id', Errors.paymentType).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                PaymentType.findById(req.body.payment_type_id)
                    .then(paymentType => paymentType ? next() : res.status(400).json([Errors.paymentTypeNotExist]))
                    .catch(err => res.status(500).json(err))
            }
        },

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.json([Errors.idInvalid])
            } else {
                req.assert('name', Errors.name).optional()
                req.assert('payment_type_id', Errors.paymentTypeFlag).optional()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },
        paymentType: (req, res, next) => isNaN(req.params.payment_type_id) ? res.status(400).json([Errors.idInvalid]) : next(),
        delete: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next()

    }
}
