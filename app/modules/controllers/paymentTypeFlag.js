
module.exports = app => {
    const PaymentTypeFlag = app.datasource.models.PaymentTypeFlag
    const PaymentType = app.datasource.models.PaymentType
    const Persistence = require('../../helpers/persistence')(PaymentTypeFlag)

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
        listAllQuery: (req, res) => {
            const query = {
                where: req.params,
                attributes: { exclude: ['payment_type_id'] },
                include: { model: PaymentType }
            }
            Persistence.listAllQuery(query, res)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
