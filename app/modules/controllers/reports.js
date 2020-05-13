module.exports = app => {

    const moment = require('moment')
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RequestDelivery = app.datasource.models.RequestDelivery
    const RequestTaxiDriver = app.datasource.models.RequestTaxiDriver
    const City = app.datasource.models.City
    const User = app.datasource.models.User
    const State = app.datasource.models.State
    const Driver = app.datasource.models.Driver
    const Company = app.datasource.models.Company
    const Rates = app.datasource.models.Rates

    return {
        reportsRunning: async (req, res) => {
            let query = {}
            let includes = []

            if (parseInt(req.body.typeRunning) === 1) {
                includes.push({ model: RequestDelivery })
                includes[0].include = []
                const Persistence = require('../../helpers/persistence')(RunningDelivery)
                if (req.body.service_id) query = Object.assign({ service_id: parseInt(req.body.service_id) }, query)
                if (req.body.status) query = Object.assign({ status: parseInt(req.body.status) }, query)
                if (req.body.city_id || req.body.state_id) {
                    includes[0].include.push({
                        model: Rates,
                        include: [
                            {
                                model: State,
                                required: true,
                                where: req.body.state_id ? { id: req.body.state_id } : { id: { $ne: null } }
                            }, {
                                model: City,
                                required: true,
                                where: req.body.city_id ? { id: req.body.city_id } : { id: { $ne: null } }
                            }
                        ]
                    })
                }

                let initDate = moment(req.body.dateInit || new Date()).utcOffset(-3).set({hour: 0, minute: 0, second: 0, millisecond: 1}).format('YYYY-MM-DD HH:MM:SS')
                let finishDate = moment(req.body.dateFinish || new Date()).utcOffset(-3).set({hour: 23, minute: 59, second: 59, millisecond: 59}).format('YYYY-MM-DD HH:MM:SS')

                if (req.body.driver_name) includes.push({ model: Driver, include: [{ model: User, where: req.body.driver_name ? { name: { $like: '%' + req.body.driver_name + '%' } } : { name: { $ne: null } } }] })

                if (req.body.name) includes.push({ model: Company, where: req.body.name ? { fantasy: { $like: '%' + req.body.name + '%' } } : { fantasy: { $ne: null } } })

                if (req.body.running_id) query = Object.assign({ id: parseInt(req.body.running_id) }, query)

                if (parseInt(req.body.typeClient) === 1) {
                    includes.push({ model: User, required: true })
                    includes.push({ model: Driver, include: [{ model: User }] })
                }

                if (parseInt(req.body.typeClient) === 2) {
                    includes.push({ model: Company, required: true, where: req.body.name ? { fantasy: { $like: '%' + req.body.name + '%' } } : { fantasy: { $ne: null } } })
                    includes.push({ model: Driver, include: [{ model: User }] })
                }


                if (includes.length === 1) includes.push({ model: User }, { model: Driver, include: [{ model: User }] }, { model: Company })

                if (req.body.dateInit || req.body.dateFinish) {
                    query = Object.assign({created_at: {$between: [initDate, finishDate]}}, query)
                }

                query = { where: query, include: includes, order: [['created_at', 'DESC']] }
                Persistence.listAllPaginated(query, res)(req.query.page)

            } else if (parseInt(req.body.typeRunning) === 2) {
                includes.push({ model: RequestTaxiDriver })
                includes[0].include = []
                const Persistence = require('../../helpers/persistence')(RunningTaxiDriver)
                if (req.body.service_id) query = Object.assign({ service_id: parseInt(req.body.service_id) }, query)
                if (req.body.status) query = Object.assign({ status: parseInt(req.body.status) }, query)
                if (req.body.city_id || req.body.state_id) {
                    includes[0].include.push({
                        model: Rates,
                        include: [
                            {
                                model: State,
                                required: true,
                                where: req.body.state_id ? { id: req.body.state_id } : { id: { $ne: null } }
                            }, {
                                model: City,
                                required: true,
                                where: req.body.city_id ? { id: req.body.city_id } : { id: { $ne: null } }
                            }
                        ]
                    })
                }

                let initDate = moment(req.body.dateInit || new Date()).utcOffset(-3).set({hour: 0, minute: 0, second: 0, millisecond: 1}).format('YYYY-MM-DD HH:MM:SS')
                let finishDate = moment(req.body.dateFinish || new Date()).utcOffset(-3).set({hour: 23, minute: 59, second: 59, millisecond: 59}).format('YYYY-MM-DD HH:MM:SS')

                if (req.body.driver_name) includes.push({ model: Driver, include: [{ model: User, where: req.body.driver_name ? { name: { $like: '%' + req.body.driver_name + '%' } } : { name: { $ne: null } } }] })

                if (req.body.name) includes.push({ model: Company, where: req.body.name ? { fantasy: { $like: '%' + req.body.name + '%' } } : { fantasy: { $ne: null } } })

                if (req.body.running_id) query = Object.assign({ id: parseInt(req.body.running_id) }, query)

                if (parseInt(req.body.typeClient) === 1) {
                    includes.push({ model: User, required: true })
                    includes.push({ model: Driver, include: [{ model: User }] })
                }

                if (parseInt(req.body.typeClient) === 2) {
                    includes.push({ model: Company, required: true, where: req.body.name ? { fantasy: { $like: '%' + req.body.name + '%' } } : { fantasy: { $ne: null } } })
                    includes.push({ model: Driver, include: [{ model: User }] })
                }


                if (includes.length === 1) includes.push({ model: User }, { model: Driver, include: [{ model: User }] }, { model: Company })

                if (req.body.dateInit || req.body.dateFinish) {
                    query = Object.assign({created_at: {$between: [initDate, finishDate]}}, query)
                }

                query = { where: query, include: includes, order: [['created_at', 'DESC']] }
                console.log(req.query)
                Persistence.listAllPaginated(query, res)(req.query.page)
            }
        }
    }
}