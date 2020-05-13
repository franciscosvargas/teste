
module.exports = app => {
    const Discount = app.datasource.models.Discount
    const Persistence = require('../../helpers/persistence')(Discount)

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
