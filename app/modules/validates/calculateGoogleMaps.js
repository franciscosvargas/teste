module.exports = app => {
    const Company = app.datasource.models.Company
    const AddressClient = app.datasource.models.AddressClient
    const Rates = app.datasource.models.Rates

    const Errors = require('../../errors/calculateGoogleMaps/pt-br')

    const Help = require('../../helpers/searchPointAnddress')(app)

    const queryFormat = (object, company) => {
        return {
            where: {
                $and: [{ service_id: object.service_id }, { city_id: company.city_id }, { state_id: company.state_id }, { country_id: company.country_id }]
            }
        }
    }

    const queryFormatCalculate = (Object, Rates, Company, AddressClient) => {
        console.log(Company.location)
        return {
            pointFinish: AddressClient.location.coordinates,
            pointInit: Company.location.coordinates,
            fixedValue: Rates.fixedValue,
            metersSurplus: Rates.metersSurplus,
            baseValue: Rates.baseValue1,
            franchiseMeters: Rates.franchiseMeters,
            requestReturn: Object.requestReturn,
            estimateAwait: Object.estimateAwait,
            estimateAwaitValue: Rates.estimateAwaitValue,
            requestReturnValue: Rates.requestReturnValue,
            time: Object.time
        }
    }

    return {
        companyCalculate: (req, res, next) => {
            req.assert('company_id', Errors.companyId).notEmpty()
            req.assert('address_client_id', Errors.addressClient).notEmpty()
            req.assert('service_id', Errors.serviceId).notEmpty()
            req.assert('requestReturn', Errors.requestReturn).optional().notEmpty()
            req.assert('estimateAwait', Errors.estimateAwait).optional().notEmpty()
            req.assert('time', Errors.time).optional().isInt()
            req.body.time = req.body.time ? req.body.time : 0.0
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Company.findOne({where: {id: parseInt(req.body.company_id)}})
                    .then(company => {
                        if (company) {
                            AddressClient.findById(req.body.address_client_id)
                                .then(addressClient => {
                                    if (addressClient) {
                                        const query = queryFormat(req.body, company.dataValues)
                                        Rates.findOne(query)
                                            .then(rates => {
                                                if (rates) {
                                                    try {
                                                        req.body.query = queryFormatCalculate(req.body, rates.dataValues, company.dataValues, addressClient.dataValues)
                                                        // TODO Anotação feita por: Tiago Pedro
                                                        // Isto acontece pois a validação está fazendo um parse nos dados da Compania, ou seja está mudando na visão do controlador o que é recebido da requisição
                                                        // Para não levar muito tempo na atividade, setei os endereços abaixo para visualizar no controller.
                                                        req.body.query.address_client = addressClient.address + ', ' + addressClient.number + ', ' + addressClient.district + ', ' + addressClient.zipCode
                                                        req.body.query.adress_company = company.address + ', ' + company.number + ', ' + company.district + ', ' + company.zipCode

                                                        next()
                                                    } catch (err) {
                                                        console.log(err)
                                                        res.status(400).json(err)
                                                    }
                                                } else {
                                                    res.status(500).json([Errors.ratesNotExist])
                                                }
                                            })
                                            .catch(err => res.status(500).json(err))
                                    } else {
                                        res.status(500).json([Errors.addressClientNotExist])
                                    }
                                })
                                .catch(err => res.status(500).json(err))
                        } else {
                            res.status(400).json([Errors.companyNotExist])
                        }
                    })
                    .catch(err => res.status(500).json(err))
            }
        },

        taxiCalculate: (req, res, next) => {
            req.assert('clientLat', Errors.companyId).notEmpty()
            req.assert('clientLng', Errors.addressClient).notEmpty()
            req.assert('destinationLat', Errors.companyId).notEmpty()
            req.assert('destinationLng', Errors.addressClient).notEmpty()
            req.assert('service_id', Errors.serviceId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Help.pointAddressTaxi(req.body)
                    .then(response => response ? next() : res.status(400).json([Errors.calculateRoute]))
                    .catch(err => res.status(400).json(err))
            }
        },
        locationCalculate: (req, res, next) => {
            req.assert('clientLat', Errors.clientLat).notEmpty()
            req.assert('clientLng', Errors.clientLng).notEmpty()
            req.assert('destinationLat', Errors.destinationLat).notEmpty()
            req.assert('destinationLng', Errors.destinationLng).notEmpty()
            req.assert('service_id', Errors.serviceId).notEmpty()
            req.assert('requestReturn', Errors.requestReturn).optional().notEmpty()
            req.assert('estimateAwait', Errors.estimateAwait).optional().notEmpty()
            req.assert('time', Errors.time).optional()
            req.body.time = req.body.time ? req.body.time : 0.0
            const error = req.validationErrors()
            error
                ? res.status(400).json(error)
                : Help.pointAddressLocation(req.body)
                    .then(response => response ? next() : res.status(400).json([Errors.calculateRoute]))
                    .catch(err => res.status(400).json(err))
        }
    }
}
