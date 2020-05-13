module.exports = app => {
    const TypesVehiclesService = app.datasource.models.TypesVehiclesService
    const Persistence = require('../../helpers/persistence')(TypesVehiclesService)

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
            Persistence.listOneWithJoin(query, res)
        },
        listAll: (req, res) => {
            Persistence.listAllWithJoin(res)
        },
        listTypeVehicles: (req, res) => {
            const query = req.params
            Persistence.listOneAllWithJoin(query, res)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
