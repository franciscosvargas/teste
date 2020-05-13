module.exports = app => {
    const City = app.datasource.models.City
    const State = app.datasource.models.State
    const Country = app.datasource.models.Country

    const Errors = require('../../errors/rulesCancel/pt-br')

    return {
        create: (req, res, next) => {
            req.assert('value', Errors.value).notEmpty()
            req.assert('time', Errors.time).notEmpty()
            req.assert('country_id', Errors.countryId).notEmpty()
            req.assert('state_id', Errors.stateId).notEmpty()
            req.assert('city_id', Errors.stateId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Country.findById(req.body.city_id)
                    .then(city => {
                        if (city) {
                            State.findById(req.body.city_id)
                                .then(country => {
                                    if (country) {
                                        next()
                                    } else {
                                        City.findById(req.body.state_id)
                                            .then(state => state ? next() : res.status(400).json([Errors.stateNotExist]))
                                            .catch(err => res.status(400).json(err))
                                    }
                                })
                                .catch(err => res.status(400).json(err))
                        } else {
                            res.status(400).json(Errors.cityNotExist)
                        }
                    })
                    .catch(err => res.status(400).json(err))
            }
        },
        update: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()

    }
}
