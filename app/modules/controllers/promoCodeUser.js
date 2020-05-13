module.exports = app => {
    const PromoCodeUser = app.datasource.models.PromoCodeUser
    const Persistence = require('../../helpers/persistence')(PromoCodeUser)

    return {
        create: (req, res) => {
            delete req.body['service_id']
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
        listAll: async (req, res) => {
            Persistence.listAllQuery({
                where: {
                    user_id: req.user.object.id
                },
                include: {all: true}
            }, res)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
