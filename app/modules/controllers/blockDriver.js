module.exports = app => {
    const BlockDriver = app.datasource.models.BlockDriver
    const Company = app.datasource.models.Company
    const Driver = app.datasource.models.Driver
    const User = app.datasource.models.User
    const Persistence = require('../../helpers/persistence')(BlockDriver)

    return {
        create: (req, res) => Persistence.create(req.body, res),
        update: (req, res) => Persistence.update(req.params, req.body, res),
        listCompany: (req, res) => Persistence.listAllQuery(
            {
                where: req.params,
                include: [
                    {
                        model: Company,
                        attributes: ['socialName']
                    }, {
                        model: Driver,
                        attributes: ['id'],
                        include: [
                            {
                                model: User,
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            }, res),
        listOne: (req, res) => Persistence.listOne(req.params, res),
        listAll: (req, res) => Persistence.listAll(res),
        delete: (req, res) => Persistence.delete(req.params, res)
    }
}
