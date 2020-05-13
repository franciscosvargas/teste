module.exports = app => {
    const TypesBank = app.datasource.models.TypesBank
    const Persistence = require('../../helpers/persistence')(TypesBank)
    // const Business = require('../business/typeBank')(app)

    return {
        create: (req, res) => {
            Persistence.create(req.body, res)
        },
        update: (req, res) => {
            const query = req.params
            Persistence.update(query, req.body, res)
        },
        listOne: (req, res) => Persistence.listOne(req.params, res),
        listAll: (req, res) => Persistence.listAll(res, req.params),
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
