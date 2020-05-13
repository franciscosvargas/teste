module.exports = app => {
    const CompanyUser = app.datasource.models.CompanyUser
    const Persistence = require('../../helpers/persistence')(CompanyUser)

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
            const query = req.params
            Persistence.listAllQueryWithJoin(res, query)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
