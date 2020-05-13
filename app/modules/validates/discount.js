module.exports = app => {
    const Discount = app.datasource.models.Discount

    const Errors = require('../../errors/discount/pt-br')

    return {

        create: (req, res, next) => {
            req.assert('percent', Errors.percent).notEmpty()
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
                req.assert('percent', Errors.percent).optional()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },

        unique: (req, res, next) => {
            const query = {
                where: {
                    percent: req.body.percent
                }
            }
            Discount.findOne(query)
                .then(discount => discount ? res.status(400).json([Errors.discountExist]) : next())
                .catch(err => res.status(500).json(err))
        },

        delete: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next()

    }
}
