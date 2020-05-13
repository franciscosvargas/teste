module.exports = app => {
    const Vehicles = app.datasource.models.Vehicles
    const User = app.datasource.models.User
    const TypeVehicles = app.datasource.models.TypeVehicles
    const Help = require('../../helpers/sinesp')
    const Errors = require('../../errors/vehicles/pt-br')

    return {
        create: (req, res, next) => {
            req.assert('plate', Errors.plate).notEmpty()
            req.assert('situation', Errors.situation).notEmpty()
            req.assert('model', Errors.model).notEmpty()
            req.assert('brand', Errors.brand).notEmpty()
            req.assert('brandYear', Errors.brandYear).notEmpty()
            req.assert('color', Errors.color).notEmpty()
            req.assert('uf', Errors.uf).notEmpty()
            req.assert('city', Errors.city).notEmpty()
            req.assert('capacity', Errors.capacity).notEmpty()
            req.assert('chassi', Errors.chassi).optional()
            req.assert('user_id', Errors.userId).notEmpty()
            req.assert('type_vehicle_id', Errors.typeVehiclesId).notEmpty()

            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                TypeVehicles.findById(req.body.type_vehicle_id)
                    .then(typeVehicles => {
                        if (typeVehicles) {
                            User.findById(req.body.user_id)
                                .then(user => {
                                    if (user) {
                                        next()
                                    } else {
                                        res.status(400).json([Errors.userIdNotExist])
                                    }
                                }).catch(err => res.status(400).json(err))
                        } else {
                            res.status(400).json([Errors.typeVehiclesId])
                        }
                    }).catch(err => res.status(400).json(err))
            }
        },
        createService: (req, res, next) => {
            req.assert('plate', Errors.plate).notEmpty()
            req.assert('situation', Errors.situation).notEmpty()
            req.assert('model', Errors.model).notEmpty()
            req.assert('brand', Errors.brand).notEmpty()
            req.assert('brandYear', Errors.brandYear).notEmpty()
            req.assert('color', Errors.color).notEmpty()
            req.assert('uf', Errors.uf).notEmpty()
            req.assert('city', Errors.city).notEmpty()
            req.assert('capacity', Errors.capacity).notEmpty()
            // req.assert('chassi', Errors.chassi).notEmpty()
            req.assert('user_id', Errors.userId).notEmpty()
            req.assert('service_id', Errors.userId).notEmpty()
            req.assert('type_vehicle_id', Errors.typeVehiclesId).notEmpty()

            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                TypeVehicles.findById(req.body.type_vehicle_id)
                    .then(typeVehicles => {
                        if (typeVehicles) {
                            User.findById(req.body.user_id)
                                .then(user => {
                                    if (user) {
                                        next()
                                    } else {
                                        res.status(400).json([Errors.userIdNotExist])
                                    }
                                }).catch(err => res.status(400).json(err))
                        } else {
                            res.status(400).json([Errors.typeVehiclesId])
                        }
                    }).catch(err => res.status(400).json(err))
            }
        },
        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.status(400).json({id: 'Invalido!'})
            } else {
                req.assert('plate', Errors.plate).optional()
                req.assert('situation', Errors.situation).optional()
                req.assert('model', Errors.model).optional()
                req.assert('brand', Errors.brand).optional()
                req.assert('brandYear', Errors.brandYear).optional()
                req.assert('color', Errors.color).optional()
                req.assert('uf', Errors.uf).optional()
                req.assert('city', Errors.city).optional()
                req.assert('chassi', Errors.chassi).optional()
                req.assert('user_id', Errors.userId).optional()
                req.assert('capacity', Errors.capacity).optional()
                req.assert('type_vehicle_id', Errors.typeVehiclesId).optional()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        listOneDriver: (req, res, next) => isNaN(req.params.user_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        unique: (req, res, next) => {
            const query = {
                where: {
                    $or: [{chassi: req.body.chassi}, {plate: req.body.plate}]
                }
            }
            Vehicles.findOne(query)
                .then(vehicle => {
                    vehicle ? res.status(400).json([Errors.vehicleExist]) : next()
                }).catch(err => res.status(500).json(err))
        },
        vehiclesUse: (req, res, next) =>
            Vehicles.findOne({where: {plate: req.body.plate}})
                .then(vehicle => {
                    vehicle ? res.status(400).json([Errors.vehicleExist]) : next()
                }).catch(err => res.status(500).json(err)),
        haveVehicle: (req, res, next) => {
            const query = {
                where: {
                    $or: [{chassi: req.body.chassi}, {plate: req.body.plate}],
                    user_id: req.body.user_id
                },
                raw: true
            }
            Vehicles.findOne(query)
                .then(vehicle => {
                    vehicle ? res.status(400).json([Errors.haveVehicle]) : next()
                })
                .catch(err => res.status(500).json(err))
        },
        plate: (req, res, next) => {
            req.params.plate.length < 6
                ? res.status(res.status(400).json([Errors.plateInvalid]))
                : Help.searchPlate(req.params, res)
        },
        listByUser: (req, res, next) => {
            req.assert('user_id', Errors.userId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                next();
            }
        }
    }
}
