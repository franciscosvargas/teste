module.exports = app => {
    const TypeDocuments = app.datasource.models.TypeDocuments
    const Errors = require('../../errors/typeDocument/pt-br')
    return {
        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
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
        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        unique: (req, res, next) => {
            const query = {where: {name: req.body.name}}
            TypeDocuments.findOne(query)
                .then(type => type ? res.status(400).json([Errors.exist]) : next())
                .catch(err => res.status(500).json(err))
        }
    }
}
