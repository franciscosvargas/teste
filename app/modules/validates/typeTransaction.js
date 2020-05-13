module.exports = app => {
    const TypeTransaction = app.datasource.models.TypeTransaction

    const Errors = require('../../errors/typeTransaction/pt-br')

    return {

        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            req.assert('rate', Errors.rate).notEmpty()
            req.assert('percent', Errors.percent).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },

        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },

        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                req.assert('name', Errors.name).optional()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },

        unique: (req, res, next) => {
            const query = {where: {name: req.body.name}}
            TypeTransaction.findOne(query)
                .then(typeTransaction => typeTransaction ? res.status(400).json([Errors.typeTransactionExist]) : next())
                .catch(err => res.status(500).json(err))
        },

        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        }
    }
}
