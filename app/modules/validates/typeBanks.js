module.exports = app => {
    const TypesBank = app.datasource.models.TypesBank
    const Errors = require('../../errors/typeBank/pt-br')

    return {
        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            req.assert('code', Errors.code).notEmpty()
            req.assert('rate', Errors.rate).notEmpty()
            req.assert('description', Errors.description).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.json({id: 'Invalido!'})
            } else {
                req.assert('name', Errors.name).optional()
                req.assert('code', Errors.code).optional()
                req.assert('rate', Errors.rate).optional()
                req.assert('description', Errors.description).optional()
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
            const query = {
                where: {
                    $or: [{name: {$eq: req.body.name}}, {code: {$eq: parseFloat(req.body.code)}}]
                }
            }
            TypesBank.findOne(query)
                .then(type => type ? res.status(400).json([Errors.existTypeBank]) : next())
                .catch((err) => res.status(500).json({error: err}))
        }
    }
}
