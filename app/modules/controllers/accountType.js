module.exports = app => {
    const AccountType = app.datasource.models.AccountType
    const Persistence = require('../../helpers/persistence')(AccountType)

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
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
