module.exports = app => {
    const CityService = app.datasource.models.CityService
    const Services = app.datasource.models.Services
    const Persistence = require('../../helpers/persistence')(CityService)

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
        listAllQuery: (req, res) => {
            const query = {
                where: req.params,
                include: {model: Services}

            }
            Persistence.listAllQuery(query, res)
        },

        listAll: (req, res) => {
            Persistence.listAllWithJoin(res)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
