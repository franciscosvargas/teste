module.exports = app => {
    const RequestDelivery = app.datasource.models.RequestDelivery
    const RunningDelivery = app.datasource.models.RunningDelivery
    const PromoCode = app.datasource.models.PromoCode
    const PromoCodeUser = app.datasource.models.PromoCodeUser
    const Card = app.datasource.models.Card
    const Errors = require('../../errors/request/pt-br')

    const Help = require('../../helpers/searchPointAnddress')(app)

    const Company = app.datasource.models.Company
    const AddressClient = app.datasource.models.AddressClient
    const Rates = app.datasource.models.Rates

    const queryFormat = (object, company) => {
        return {
            where: {
                $and: [{
                    service_id: object.service_id
                }, {
                    city_id: company.city_id
                }, {
                    state_id: company.state_id
                }, {
                    country_id: company.country_id
                }]
            }
        }
    }

    const queryFormatCalculate = (Object, Rates, Company, AddressClient) => {
        return {
            pointFinish: AddressClient.location.coordinates,
            pointInit: Company.location.coordinates,
            fixedValue: Rates.fixedValue,
            metersSurplus: Rates.metersSurplus,
            baseValue: Rates.baseValue1,
            franchiseMeters: Rates.franchiseMeters,
            requestReturn: Object.requestReturn,
            freeDriver: !Object.requestReturn,
            estimateAwait: Object.estimateAwait,
            estimateAwaitValue: Rates.estimateAwaitValue,
            requestReturnValue: Rates.requestReturnValue,
            time: Object.time,
            details: Object.details,
            totalOrder: Object.totalOrder,
            valueReceive: Object.valueReceive,
            change: Object.change,
            // payment_type_flag_id: Object.payment_type_flag_id,
            client_company_id: Object.client_company_id,
            address_client_id: Object.address_client_id,
            company_id: Object.company_id,
            typePayment: Object.typePayment,
            status: true,
            rate_id: Rates.id

        }
    }
    return {
        create: (req, res, next) => {
            req.assert('company_id', Errors.companyId).notEmpty()
            req.assert('address_client_id', Errors.addressClient).notEmpty()
            req.assert('service_id', Errors.serviceId).notEmpty()
            req.assert('requestReturn', Errors.requestReturn).optional().notEmpty()
            req.assert('estimateAwait', Errors.estimateAwait).optional().notEmpty()
            req.assert('time', Errors.time).optional().isInt()
            req.assert('details', Errors.details).notEmpty()
            req.assert('totalOrder', Errors.totalOrder).notEmpty()
            req.assert('valueReceive', Errors.valueReceive).notEmpty()
            req.assert('change', Errors.change).notEmpty()
            req.assert('typePayment', Errors.typePayment).notEmpty()
            req.assert('payment_type_flag_id', Errors.change).optional()
            req.assert('client_company_id', Errors.client_company_id).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(500).json(error)
            } else {
                Company.findById(req.body.company_id)
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
                                                        res.status(200).json(err)
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

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        listOneCompany: (req, res, next) => isNaN(req.params.company_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        refund: (req, res, next) => {
            req.assert('typePayment', Errors.typePayment).isInt()
            if (isNaN(req.params.company_id)) {
                res.status(400).json([Errors.idInvalid])
            } else {
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },
        update: (req, res, next) => {},

        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        complete: (req, res, next) => {
            const query = {
                where: {
                    $and: [{
                        id: req.body.request
                    }, {
                        $or: [
                            {company_id: req.body.company_id},
                            {user_id: req.body.user_id}
                        ]
                    }, {
                        running_delivery_id: null
                    }]
                },
                include: [{model: Rates}]
            }
            RequestDelivery.findAll(query)
                .then(request => {
                    if (request.length > 0) {
                        req.body.auxiliary = req.body.request
                        req.body.request = request
                        next()
                    } else {
                        console.log('estou aqui')
                        res.status(400).json([Errors.requestNotExist])
                    }
                })
                .catch(err => res.status(500).json(err))
        },
        isPromocode: (req, res, next) =>
            (req.body.promo_code_id)
                ? PromoCodeUser.findOne({
                    where: {
                        $and: [
                            {promo_code_id: req.body.promo_code_id},
                            {user_id: req.body.user_id}
                        ]
                    },
                    include: [
                        {model: PromoCode, where: {id: req.body.promo_code_id, typePayment: req.body.typePayment}}
                    ]
                })
                    .then(promocode => {
                        if (promocode) {
                            req.body.promocode = promocode.dataValues.PromoCode.dataValues
                            next()
                        } else {
                            console.log('estoua aqui')
                            res.status(400).json([Errors.promocodeId])
                        }
                    })
                    .catch(err => res.status(500).json(err))
                : next(),
        isCard: (req, res, next) => {
            if (req.body.card_id !== null && req.body.typePayment === 2) {
                Card.findOne({where: {$and: [{cardId: req.body.card_id}, {user_id: req.body.user_id}]}, raw: true})
                    .then(card => card ? next() : res.status(400).json([{title: 'Cartão', message: 'Cartão não existe!'}]))
                    .catch(err => res.status(500).json(err))
            } else {
                next()
            }
        },
        isPromocodeValidateUserDelivery: (req, res, next) =>
            (req.body.promo_code_id)
                ? RequestDelivery.count({
                    where: {
                        $and: [
                            {
                                user_id: req.body.user_id
                            }, {
                                promo_code_id: req.body.promo_code_id
                            }
                        ]
                    },
                    include: [
                        {
                            model: RunningDelivery,
                            required: true,
                            where: {status: {$in: [6, 10]}},
                        }
                    ]
                })
                    .then(resp => {
                        if (resp.length === 0) {
                            next()
                        } else {
                            if ((parseInt(resp) === req.body.promocode.amountPerUser)) {
                                res.status(400).json([{title: 'Código Promocional', message: 'Código promocional inválido!'}])
                            } else if (parseInt(resp) === req.body.promocode.amount) {
                                res.status(400).json([{title: 'Código Promocional', message: 'Código promocional inválido!'}])
                            } else {
                                next()
                            }
                        }
                    })
                    .catch(err => console.log(err))
                : next(),
        
        locationCalculateUser: (req, res, next) => {
            req.assert('origin_address', Errors.origin_address).notEmpty()
            req.assert('destination_address', Errors.destination_address).notEmpty()
            req.body.time = req.body.time ? req.body.time : 0.0
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                next();
            }
        },
        locationCalculate: (req, res, next) => {
            req.assert('clientLat', Errors.clientLat).notEmpty()
            req.assert('clientLng', Errors.clientLng).notEmpty()
            req.assert('client_company_id', Errors.client_company_id).notEmpty()
            req.assert('service_id', Errors.serviceId).notEmpty()
            req.assert('requestReturn', Errors.requestReturn).optional().notEmpty()
            req.assert('estimateAwait', Errors.estimateAwait).optional().notEmpty()
            req.assert('details', Errors.details).optional()
            req.assert('totalOrder', Errors.totalOrder).notEmpty()
            req.assert('valueReceive', Errors.valueReceive).notEmpty()
            req.assert('change', Errors.change).notEmpty()
            req.assert('typePayment', Errors.typePayment).notEmpty()
            req.assert('payment_type_flag_id', Errors.change).optional()
            req.assert('time', Errors.time).optional().isInt()
            req.body.time = req.body.time ? req.body.time : 0.0
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Help.pointAddressLocation(req.body)
                    .then(response => response ? next() : res.status(400).json([Errors.calculateRoute]))
                    .catch(err => res.status(400).json(err))
            }
        }

    }
}
