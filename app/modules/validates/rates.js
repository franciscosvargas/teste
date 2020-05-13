module.exports = app => {
    const Country = app.datasource.models.Country
    const State = app.datasource.models.State
    const City = app.datasource.models.City

    const Errors = require('../../errors/rates/pt-br')
    return {
        create: (req, res, next) => {
            req.assert('baseValue1', Errors.baseValue1).notEmpty()
            req.assert('baseValue2', Errors.baseValue2).notEmpty()
            req.assert('typeCalculate', Errors.typeCalculate).notEmpty()
            req.assert('franchiseMeters', Errors.franchiseMeters).notEmpty()
            req.assert('minBandeirada1', Errors.minBandeirada1).isFloat()
            req.assert('minBandeirada2', Errors.minBandeirada2).isFloat()
            req.assert('valueKm1', Errors.valueKm1).isFloat()
            req.assert('valueKm2', Errors.valueKm2).isFloat()
            req.assert('requestReturnValue', Errors.requestReturnValue).isFloat()
            req.assert('estimateAwaitValue', Errors.estimateAwaitvalue).isFloat()
            req.assert('fixedValue', Errors.fixedValue).notEmpty()
            req.assert('metersSurplus', Errors.metersSurplus).notEmpty()
            req.assert('country_id', Errors.countryId).notEmpty()
            req.assert('state_id', Errors.stateId).notEmpty()
            req.assert('city_id', Errors.cityId).notEmpty()
            req.assert('dailyValue', Errors.dailyValue).notEmpty()
            req.assert('service_id', Errors.serviceId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Country.findById(req.body.country_id)
                    .then(country => {
                        if (country) {
                            City.findById(req.body.city_id)
                                .then(city => {
                                    if (city) {
                                        State.findById(req.body.state_id)
                                            .then(state => {
                                                if (state) {
                                                    next()
                                                } else {
                                                    res.status(400).json([Errors.state])
                                                }
                                            }).catch(err => res.status(500).json(err))
                                    } else {
                                        res.status(400).json([Errors.city])
                                    }
                                }).catch(err => res.status(500).json(err))
                        } else {
                            res.status(400).json([Errors.country])
                        }
                    }).catch(err => res.status(500).json(err))
            }
        },
        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        update: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
    }
}
