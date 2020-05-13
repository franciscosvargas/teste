
module.exports = app => {
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const Errors = require('../../errors/logSendNotificationRunning/pt-br')
    return {
        listOne: (req, res, next) =>
            isNaN(req.params.running_delivery_id)
                ? res.status(400).json([Errors.idInvalid])
                : RunningDelivery.findById(req.params.running_delivery_id)
                    .then(running => running ? next() : res.status(400).json([Errors.running_delivery_id]))
                    .catch(err => res.status(500).json(err)),
        listOneParticular: (req, res, next) => 
            isNaN(req.params.running_taxi_driver_id)
                ? res.status(400).json([Errors.idInvalid])
                : RunningTaxiDriver.findById(req.params.running_taxi_driver_id)
                    .then(running => running ? next() : res.status(400).json([Errors.running_delivery_id]))
                    .catch(err => res.status(500).json(err)),
        
        delete: (req, res, next) => isNaN(req.params.running_delivery_id) ? res.status(400).json([Errors.idInvalid]) : next()
    }
}
