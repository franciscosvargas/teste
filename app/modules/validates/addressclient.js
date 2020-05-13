module.exports = app => {
    const Errors = require('../../errors/addressClient/pt-br')
    const ClientCompany = app.datasource.models.ClientCompany
    return {
        create: (req, res, next) => {
            req.assert('zipCode', Errors.zipCode).notEmpty()
            req.assert('address', Errors.address).notEmpty()
            req.assert('number', Errors.number).notEmpty()
            req.assert('district', Errors.district).notEmpty()
            req.assert('complement', Errors.complement).optional()
            req.assert('state_id', Errors.state).notEmpty()
            req.assert('city_id', Errors.city).notEmpty()
            req.assert('country_id', Errors.country).notEmpty()
            req.assert('client_company_id', Errors.clientCompanyId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                ClientCompany.findById(req.body.client_company_id)
                    .then(clientCompany => !clientCompany ? res.status(400).json([Errors.clientCompanyNotExist]) : next())
                    .catch(err => res.status(500).json(err))
            }
        },
        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                req.assert('zipCode', Errors.zipCode).optional()
                req.assert('address', Errors.address).optional()
                req.assert('number', Errors.number).optional()
                req.assert('district', Errors.district).optional()
                req.assert('complement', Errors.complement).optional()
                req.assert('state', Errors.state).optional()
                req.assert('city', Errors.city).optional()
                req.assert('client_company_id', Errors.clientCompanyId).notEmpty()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },
        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
    }
}
