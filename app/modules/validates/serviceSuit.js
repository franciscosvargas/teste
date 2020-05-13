module.exports = app => {
    const Errors = require('../../errors/serviceSuit/pt-br')
    return {
        create: (req, res, next) => {
            req.assert('copyright', Errors.copyright).notEmpty()
            req.assert('termAndConditions', Errors.termAndConditions).notEmpty()
            req.assert('privacyPolicy', Errors.privacyPolicy).notEmpty()
            req.assert('dataProviders', Errors.dataProviders).notEmpty()
            req.assert('softwareLicenses', Errors.softwareLicenses).notEmpty()
            req.assert('locationData', Errors.locationData).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        update: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        }
    }
}
