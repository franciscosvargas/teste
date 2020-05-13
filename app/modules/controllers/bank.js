
module.exports = app => {
    const Bank = app.datasource.models.Bank
    const Persistence = require('../../helpers/persistence')(Bank)
    const Business = require('../business/bank')(app)

    return {
        create: async (req, res) => {
            try {
                const user = await Business.listOneUserDriver(req)
                // await Business.sendEmail(user)
                await Business.stageUser(req)
                req.body.cpf = req.body.cpf || user.dataValues.cpf
                Persistence.create(req.body, res)
            } catch (err) {                
                res.status(500).json(err)
            }
        },
        update: async (req, res) => {
            try {
                // const business = await Business.create(req)
                Persistence.update(req.params, req.body, res)
            } catch (err) {
                res.status(500).json(err)
            }
        },
        listOne: (req, res) => Persistence.listOneWithJoin(req.params, res),
        listAll: (req, res) => {
            const query = Business.listAll()
            Persistence.listAll(res, query)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
