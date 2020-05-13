module.exports = app => {
    const LastLocation = app.datasource.models.LastLocation
    const Errors = require('../../errors/lastLocation/pt-br')
    const Driver = app.datasource.models.Driver
    return {
        create: (req, res, next) => {
            req.assert('lat', Errors.lat).notEmpty()
            req.assert('lng', Errors.lng).notEmpty()
            req.assert('driver_id', Errors.driverId).isInt()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Driver.findById(req.body.driver_id)
                    .then(user => user ? next() : res.status(400).json([Errors.userNotExist]))
                    .catch(err => res.status(400).json(err))
            }
        },

        update: (req, res, next) => {
            if (isNaN(req.params.driver_id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                req.assert('lat', Errors.lat).notEmpty()
                req.assert('lng', Errors.lng).notEmpty()
                const error = req.validationErrors()
                if (error) {
                    res.status(400).json(error)
                } else {
                    Driver.findById(req.params.driver_id)
                        .then(user => user ? next() : res.status(500).json([Errors.driverNotExist]))
                        .catch(err => res.status(500).json(err))
                }
            }
        },

        listOne: (req, res, next) => isNaN(req.params.user_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        listOneDriver: (req, res, next) => isNaN(req.params.driver_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        unique: (req, res, next) => {
            const query = {driver_id: req.body.driver_id}
            LastLocation.findOne(query)
                .then(lastLocation => lastLocation ? res.status(400).json([Errors.lastLocationExist]) : next())
                .catch(err => res.status(500).json(err))
        },

        searchDriver: (req, res, next) => {
            req.assert('lat', Errors.lat).notEmpty()
            req.assert('lng', Errors.lng).notEmpty()
            req.assert('distance', Errors.distance).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        }
    }
}
