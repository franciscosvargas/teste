
module.exports = app => {
    const Client = app.datasource.models.Client

    const Persistence = require('../../helpers/persistence')(Client)
    const Bussiness = require('../business/client')(app)

    return {
        create: (req, res) => {
            Persistence.create(req.body, res)
        },
        update: (req, res) => {
            const query = req.params
            console.log(query)
            console.log(req.body)
            Persistence.update(query, req.body, res)
        },
        listOne: (req, res) => {
            const query = Bussiness.listOne(req)
            Persistence.listOne(query, res)
        },
        listAll: (req, res) => {
            const query = Bussiness.listAll()
            Persistence.listAll(res, query)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
