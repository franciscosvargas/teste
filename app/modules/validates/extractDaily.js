module.exports = app => {
    const Errors = require('../../errors/extractDaily/pt-br')
    return {
        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        update: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next(),
        listExtractDriver: (req, res, next) => isNaN(req.params.driver_id) ? res.json([Errors.idInvalid]) : next(),
        paymentBetween: (req, res, next) => {
            req.assert('init', Errors.init).notEmpty()
            req.assert('finish', Errors.finish).notEmpty()
            req.assert('driver_id', Errors.finish).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        listExtract: (req, res, next) => isNaN(req.params.driver_id) || isNaN(req.params.service_id) ? res.json([Errors.idInvalid]) : next()
    }
}
