module.exports = app => {
    const TypeCompany = app.datasource.models.TypeCompany

    const Errors = require('../../errors/typesCompany/pt-br')

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
            req.assert('name', Errors.name).optional()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        unique: (req, res, next) => {
            const query = {where: {name: req.body.name}}
            TypeCompany.findOne(query)
                .then(typeCompany => typeCompany ? res.status(400).json([Errors.typeCompanyExist]) : next())
                .catch(err => res.status(500).json(err))
        },
        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        }
    }
}
