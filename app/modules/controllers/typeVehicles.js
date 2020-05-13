module.exports = app => {
    const TypeVehicles = app.datasource.models.TypeVehicles
    const Persistence = require('../../helpers/persistence')(TypeVehicles)

    return {
        create: (req, res) => {
            Persistence.create(req.body, res)
        },
        update: (req, res) => {
            const query = req.params
            Persistence.update(query, req.body, res)
        },
        listOne: (req, res) => {
            const query = req.params
            Persistence.listOne(query, res)
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
