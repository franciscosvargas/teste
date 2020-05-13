
module.exports = app => {
    const Device = app.datasource.models.Devices
    const Persistence = require('../../helpers/persistence')(Device)
    const Business = require('../business/device')(app)

    return {
        create: (req, res) => Persistence.create(req.body, res),
        
        update: (req, res) => Persistence.update(req.params, req.body, res),
        
        listOne: (req, res) => {
            const query = Business.listOne(req)
            Persistence.listOneNotWhere(query, res)
        },
        listOneUser: (req, res) => Persistence.listOne(req.params, res),
        listAll: (req, res) => Persistence.listAll(res),
        
        pushClient: (req, res) => {
            Business.listOneRunning(req.body.running_delivery_id)
                .then(Business.pushNotification(req.body.tokenGcm))
                .then(response => res.status(200).json(response.data))
                .catch(err => res.status(500).json(err.response.data))
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
