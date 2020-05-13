
module.exports = app => {
    const Vehicles = app.datasource.models.Vehicles
    const Persistence = require('../../helpers/persistence')(Vehicles)
    const Business = require('../business/driver')(app)

    return {
        create: async (req, res) => {
            try {
                req.body.chassi = req.body.chassi || '**** 123'
                await Business.isDriver(req.body)
                const vehicle = await Vehicles.create(req.body)
                await Business.stageUser(req.body)
                res.status(200).json(vehicle)
            } catch (err) {
                res.status(500).json(err)
            }
        },
        update: (req, res) => {
            const query = req.params
            Persistence.update(query, req.body, res)
        },
        listOne: (req, res) => {
            const query = req.params
            Persistence.listOneWithJoin(query, res)
        },
        listAll: (req, res) => {
            Persistence.listAllWithJoin(res)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        },
        createService: async (req, res) => {
            try {
                req.body.chassi = req.body.chassi || '**** 123'
                await Business.isDriver(req.body)
                await Business.updateService(req.body)()
                const vehicle = await Vehicles.create(req.body)
                if (vehicle) await Business.stageUser(req.body)
                res.status(200).json(vehicle)
            } catch (err) {
                res.status(500).json(err)
            }
        },
        listByUser: (req, res) => {
            Persistence.listOneAllWithJoin({user_id: req.params.user_id}, res)
        }
    }
}
