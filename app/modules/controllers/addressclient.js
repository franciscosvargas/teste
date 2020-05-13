module.exports = app => {
    const AddressClient = app.datasource.models.AddressClient
    const Persistence = require('../../helpers/persistence')(AddressClient)

    const Business = require('../business/address')(app)

    return {
        create: (req, res) => {
            Business.create(req.body)
                .then(object => Persistence.create(object, res))
                .catch(err => res.status(500).json(err))
        },
         update: (req, res) => {
            const query = req.params
            Business.create(req.body)
                .then(object => Persistence.update(query, object, res))
                .catch(err => res.status(500).json(err))
        },
        listOne: (req, res) => {
            const query = req.params
            Persistence.listOne(query, res)
        },
        listAll: (req, res) => Persistence.listAll(res),
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
