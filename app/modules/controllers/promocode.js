module.exports = app => {
    const PromoCode = app.datasource.models.PromoCode
    const Persistence = require('../../helpers/persistence')(PromoCode)
    const Business = require('../business/promoCode')(app)

    return {
        create: (req, res) =>
            Business.create(req.body)
                .then(object => Persistence.create(object, res))
                .catch(err => res.status(400).json(err)),
        update: (req, res) => Persistence.update(req.params, req.body, res),
        listOne: (req, res) => Persistence.listOneWithJoin(req.params, res),
        listAll: (req, res) => {
            Persistence.listAllQueryWithJoin({where: {status: true}}, res)
        },
        delete: (req, res) => Persistence.delete(req.params, res),
        block: (req, res) => Persistence.update({id: req.params.id}, {status: false}, res)
    }
}
