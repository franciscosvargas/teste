module.exports = app => {
    const Errors = require('../../errors/financialTransaction/pt-br')
    return {
        isId: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next(),
        revenues: (req, res, next) => {
            req.assert('init', Errors.init).notEmpty()
            req.assert('finish', Errors.finish).notEmpty()
            req.assert('sevice_id', Errors.service_id).optional()
            req.assert('typePayment', Errors.typePayment).optional()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        }
    }
}
