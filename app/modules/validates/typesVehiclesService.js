module.exports = app => {
    const Services = app.datasource.models.Services
    const TypeVehicles = app.datasource.models.TypeVehicles
    const Errors = require('../../errors/typesVehiclesService/pt-br')
    return {
        create: (req, res, next) => {
            req.assert('type_vehicle_id', Errors.typeVehicleId).notEmpty()
            req.assert('service_id', Errors.serviceId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Services.findById(req.body.service_id)
                    .then(service => {
                        if (service) {
                            TypeVehicles.findById(req.body.type_vehicle_id)
                                .then(typeVehicle => {
                                    typeVehicle
                                        ? next()
                                        : res.status(400).json(Errors.typeVehicleIdNotExist)
                                })
                                .catch(err => res.status(500).json(err))
                        } else {
                            res.status(400).json([Errors.serviceIdNotExist])
                        }
                    })
                    .catch(err => res.status(500).json(err))
            }
        },

        update: (req, res, next) => {
            req.assert('type_vehicle_id', Errors.typeVehicleId).optional()
            req.assert('service_id', Errors.serviceId).optional()
            const error = req.validationErrors()
            if (isNaN(req.params.id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                error ? res.status(400).json(error) : next()
            }
        },

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        listTypeVehicles: (req, res, next) => isNaN(req.params.type_vehicle_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()

    }
}
