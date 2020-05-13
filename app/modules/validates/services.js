module.exports = app => {
    const Service = app.datasource.models.Services

    const Errors = require('../../errors/service/pt-br')

    return {
        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        unique: (req, res, next) => {
            const query = {where: {name: req.body.name}}
            Service.findOne(query)
                .then(service => service ? res.status(400).json([Errors.serviceExist]) : next())
                .catch(err => res.status(500).json(err))
        },
        update: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        }
    }
}
