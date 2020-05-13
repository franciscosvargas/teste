module.exports = app => {
    const Errors = require('../../errors/contact/pt-br')
    return {
        create: (req, res, next) => {
            req.assert('email', Errors.email).notEmpty()
            req.assert('name', Errors.name).notEmpty()
            req.assert('description', Errors.description).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        isId: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
    }
}
