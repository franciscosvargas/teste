module.exports = app => {
    const Vehicles = app.datasource.models.Vehicles
    const TypesVehiclesService = app.datasource.models.TypesVehiclesService
    const Driver = app.datasource.models.Driver
    const Errors = require('../../errors/vehicleService/pt-br')

    const TypesVehiclesSuccess = (req, res, next, Errors) => (service) =>
        (service) || res.status(400).json([Errors.vehicleServiceIdNotExist])

    const DriverSuccess = (req, res, next, Errors) => (driver) => {
        if (driver) {
            return TypesVehiclesService.findById(req.body.types_vehicles_service_id)
        } else {
            return res.status(400).json([Errors.driverNotExist])
        }
    }

    const VehicleSuccess = (req, res, next, Errors) => (vehicle) =>
        (vehicle) ? Driver.findById(req.body.driver_id) : res.status(400).json([Errors.vehicleNotExist])

    const returnService = (req, res, next, Errors) => (service) => res.status(200).json(service)

    const validate = (req, res, next, Errors) => {
        req.assert('types_vehicles_service_id', Errors.vehicleServiceId).notEmpty()
        req.assert('vehicle_id', Errors.vehicleId).notEmpty()
        req.assert('driver_id', Errors.driverId).notEmpty()
        req.assert('user_id', Errors.userId).notEmpty().isInt()
        return req.validationErrors()
    }

    return {
        create: (req, res, next) => {
            console.log(req.body)
            const error = validate(req, res, next, Errors)
            if (error) {
                res.status(400).json(error)
            } else {
                const query = {
                    where: {
                        $and: [{
                            user_id: req.body.user_id
                        },
                        {
                            id: req.body.vehicle_id
                        }
                        ]
                    }
                }

                return Vehicles.findOne(query)
                    .then(VehicleSuccess(req, res, next, Errors))
                    .then(DriverSuccess(req, res, next, Errors))
                    .then(TypesVehiclesSuccess(req, res, next, Errors))
                    .then(returnService(req, res, next, Errors))
                    .catch(err => console.log(err))
            }
        },
        listVehicleOne: (req, res, next) => isNaN(req.params.vehicle_id) ? res.status(400).json([Errors.idInvalid]) : next(),
        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        update: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
    }
}
