
module.exports = app => {
    const LogSendNotificationRunning = app.datasource.models.LogSendNotificationRunning
    const User = app.datasource.models.User
    const Persistence = require('../../helpers/persistence')(LogSendNotificationRunning)

    return {
        listOne: (req, res) => {
            LogSendNotificationRunning.findAll({
                where: {
                    running_delivery_id: req.params.running_delivery_id
                },
                attributes: ['driver_id', 'created_at', 'description'],
                include: [
                    { model: User, attributes: ['name'] }
                ]
            })
                .then(response => res.status(200).json(response))
                .catch(err => res.status(500).json(err))
        },
        listOneParticular: (req, res) => {
            LogSendNotificationRunning.findAll({
                where: {
                    running_taxi_driver_id: req.params.running_taxi_driver_id
                },
                attributes: ['driver_id', 'created_at', 'description'],
                include: [
                    { model: User, attributes: ['name'] }
                ]
            })
                .then(response => res.status(200).json(response))
                .catch(err => res.status(500).json(err))
        },
        listAll: (req, res) => {
            Persistence.listAll(res)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
