module.exports = app => {
    const Errors = require('../../errors/device/pt-br')
    const Driver = app.datasource.models.Driver
    const Device = app.datasource.models.Devices

    return {
        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            req.assert('tokenGcm', Errors.tokenGcm).notEmpty()
            req.assert('serial', Errors.serial).notEmpty()
            req.assert('driver_id', Errors.driver_id).optional()
            req.assert('user_id', Errors.user_id).optional()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else if (req.body.driver_id) {
                Driver.findById(req.body.driver_id)
                    .then(driver => driver ? next() : res.status(400).json({
                        error: 'driver not exist!'
                    }))
                    .catch(err => res.status(500).json(err))
            } else {
                next()
            }
        },
        listOne: (req, res, next) => isNaN(req.params.id) ? res.json({
            id: 'Invalid!'
        }) : next(),

        update: (req, res, next) => isNaN(req.params.id) ? res.json({
            id: 'Invalid!'
        }) : next(),

        delete: (req, res, next) => isNaN(req.params.id) ? res.json({
            id: 'Invalid!'
        }) : next(),

        updateDriver: (req, res, next) => isNaN(req.params.driver_id) ? res.json({
            id: 'Invalid!'
        }) : next(),

        unique: (req, res, next) => {
            const query = {
                where: {
                    driver_id: req.body.driver_id
                }
            }
            Device.findOne(query)
                .then(device => device ? res.status(400).json({
                    title: 'Dispositivo',
                    message: 'Dispositivo já existe!'
                }) : next())
                .catch(err => res.status(500).json(err))
        },
        user: (req, res, next) => isNaN(req.params.user_id) ? res.json([Errors.idInvalid]) : next(),
        userPush: (req, res, next) => {
            req.assert('tokenGcm', Errors.tokenGcm).notEmpty()
            req.assert('running_delivery_id', Errors.runningDelivery).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        isToken: (req, res, next) => {
            const query = {
                where: {
                    tokenGcm: {
                        $eq: req.body.tokenGcm
                    }
                }
            }
            const mod = {
                tokenGcm: '-'
            }
            Device.update(mod, query)
                .then(() => next())
                .catch(err => res.status(500).json(err))
        }
    }
}