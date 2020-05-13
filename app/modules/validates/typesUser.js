module.exports = app => {
    const TypesUser = app.datasource.models.TypesUser
    const Errors = require('../../errors/typesUser/pt-br')
    return {
        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            req.assert('alias', Errors.alias).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                req.assert('name', Errors.name).optional()
                req.assert('alias', Errors.alias).optional()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },
        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.alias]) : next()
        },
        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        unique: (req, res, next) => {
            const query = {where: {name: req.body.name}}
            TypesUser.findOne(query)
                .then(type => type ? res.status(400).json([Errors.exist]) : next())
                .catch(err => res.status(500).json(err))
        }
    }
}
