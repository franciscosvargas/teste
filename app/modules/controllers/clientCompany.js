module.exports = app => {
    const ClientCompany = app.datasource.models.ClientCompany
    const AddressClient = app.datasource.models.AddressClient
    const City = app.datasource.models.City
    const State = app.datasource.models.State
    const Persistence = require('../../helpers/persistence')(ClientCompany)

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
        listAll: (req, res) => Persistence.listAllPaginated({
            where: {
                company_id: parseInt(req.query.company_id)
            },
            include: [
                {
                    model: AddressClient,
                    required: true,
                    include: [{
                        model: City
                    },
                    {
                        model: State
                    }]
                }
            ]
        }, res)(req.query.page),
        searchPhone: (req, res) => {
            const query = {
                phone: req.params.phone,
                company_id: req.params.id
            }
            Persistence.listOneWithJoin(query, res)
        },
        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        }
    }
}
