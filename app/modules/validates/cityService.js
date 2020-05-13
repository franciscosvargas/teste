module.exports = app => {
    const CityService = app.datasource.models.CityService
    const Errors = require('../../errors/cityService/pt-br')

    return {
        create: (req, res, next) => {
            req.assert('country_id', Errors.countryId).notEmpty()
            req.assert('city_id', Errors.cityId).notEmpty()
            req.assert('state_id', Errors.stateId).notEmpty()
            req.assert('service_id', Errors.serviceId).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },

        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                req.assert('country_id', Errors.countryId).optional()
                req.assert('city_id', Errors.cityId).optional()
                req.assert('state_id', Errors.stateId).optional()
                req.assert('service_id', Errors.serviceId).optional()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },
        unique: (req, res, next) => {
            const query = {
                where: {
                    $and: [{city_id: req.body.city_id}, {service_id: req.body.service_id}]
                }
            }
            CityService.findOne(query)
                .then(city => city ? res.status(400).json([Errors.cityService]) : next())
                .catch(err => res.status(500).json(err))
        },
        listCity: (req, res, next) => {
            isNaN(req.params.city_id) ? res.status(400).json([Errors.cityIdInvalid]) : next()
        },
        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        }
    }
}
