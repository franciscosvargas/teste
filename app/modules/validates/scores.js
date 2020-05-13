module.exports = app => {
    const User = app.datasource.models.User
    const Driver = app.datasource.models.Driver

    const Errors = require('../../errors/scores/pt-br')

    return {
        create: (req, res, next) => {
            req.assert('user_id', Errors.user_id).notEmpty()
            req.assert('driver_id', Errors.driver).notEmpty()
            req.assert('star', Errors.star).notEmpty()
            req.assert('running_delivery_id', Errors.runningId).optional()
            req.assert('running_taxi_driver_id', Errors.runningId).optional()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.alias]) : next(),

        average: (req, res, next) => isNaN(req.params.driver_id) ? res.status(400).json([Errors.alias]) : next()

    }
}
