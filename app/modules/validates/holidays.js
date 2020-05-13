module.exports = app => {
    const Holidays = app.datasource.models.Holidays
    const State = app.datasource.models.State
    const Country = app.datasource.models.Country
    const City = app.datasource.models.City

    const Errors = require('../../errors/holidays/pt-br')

    return {

        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            req.assert('date', Errors.date).notEmpty()
            req.assert('country_id', Errors.country).notEmpty().isInt()
            req.assert('state_id', Errors.state).notEmpty().isInt()
            req.assert('city_id', Errors.city).notEmpty().isInt()

            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                City.findById(req.body.city_id)
                    .then(city => {
                        if (city) {
                            State.findById(req.body.state_id)
                                .then(state => {
                                    if (state) {
                                        Country.findById(req.body.country_id)
                                            .then(country => country ? next() : res.status(400).json([Errors.countryNotExist]))
                                            .catch(err => res.status(500).json(err))
                                    } else {
                                        res.status(400).json([Errors.stateNotExist])
                                    }
                                })
                                .catch(err => res.status(500).json(err))
                        } else {
                            res.status(400).json([Errors.cityNotExist])
                        }
                    })
                    .catch(err => res.status(500).json(err))
            }
        },

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                req.assert('name', Errors.name).optional()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },

        unique: (req, res, next) => {
            const query = {
                where: { name: req.body.name }
            }
            Holidays.findOne(query)
                .then(holidays => holidays ? res.status(400).json([Errors.notExist]) : next())
                .catch(err => res.status(500).json(err))
        }

    }
}
