module.exports = app => {
    const PromoCode = app.datasource.models.promocodes
    const Persistence = require('../../helpers/persistence')(PromoCode)

    return {
        create: (req, res) => Persistence.create(req.body, res),
        update: (req, res) => Persistence.update({id: req.body.id}, req.body, res),
        listOne: (req, res) => Persistence.listOneWithJoin(req.params, res),
        listAll: (req, res) => {
            Persistence.listAllQueryWithJoin({where: req.params}, res)
        },
        delete: (req, res) => Persistence.delete(req.params, res),
        disable: (req, res) => Persistence.update({id: req.params.id}, {status: "Desativado"}, res)
    }
}
