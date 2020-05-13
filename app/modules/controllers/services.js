
module.exports = app => {
    const Service = app.datasource.models.Services
    const Rates = app.datasource.models.Rates
    const City = app.datasource.models.City
    const State = app.datasource.models.State
    const Country = app.datasource.models.Country
    const Persistence = require('../../helpers/persistence')(Service)
    const GoogleMaps = require('../../helpers/googleMaps')
    return {
        create: (req, res) => {
            Persistence.create(req.body, res)
        },
        locationService: async (req, res) => {
            try {
                const googleObject = await GoogleMaps.returnCityStateCountry(req.body)

                console.log()
                const services = await Service.findAll({
                    where: {},
                    attributes: ['id'],
                    include: [
                        {
                            model: Rates,
                            attributes: ['id'],
                            required: true,
                            include: [
                                { model: City, where: { name: googleObject.address.city }, attributes: ['name'], required: true },
                                { model: State, where: { initials: googleObject.address.state }, attributes: ['name'], required: true },
                                { model: Country, where: { initials: googleObject.address.country }, attributes: ['name'], required: true }
                            ]
                        }
                    ]
                })
                res.status(200).json(services)
            } catch (err) {
                console.log(err)
                res.status(400).json(err)
            }
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
