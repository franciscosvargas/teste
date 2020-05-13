module.exports = app => {
    const RequestDelivery = app.datasource.models.RequestDelivery
    const RunningDelivery = app.datasource.models.RunningDelivery
    const Persistence = require('../../helpers/persistence')(RequestDelivery)
    const Help = require('../../helpers/googleMaps')
    const HelpPagarme = require('../../helpers/tratmentPagarme')
    const Company = require('../business/company')(app)
    const Taxi = require('../business/taxi')(app)
    const Business = require('../business/requestDelivery')(app)
    const HelpCielo = require('../../helpers/tratmentCielo')
    const FinancialTransactionBusiness = require('../business/financialTransaction')(app)

    return {
        create: async (req, res) => {
            try {
                const help = await Help.calculatePointAddress(req.body.query)
                help.originAddresses[0] = req.body.query.adress_company
                help.destinationAddresses[0] = req.body.query.address_client
                const business = await Business.create(help, req.body)
                business.payment_type_id = req.body.payment_type_id
                business.service_id = req.body.servide_id
                business.rate_id = req.body.query.rate_id
                business.payment_type_flag_id = req.body.payment_type_flag_id || null
                Persistence.create(business, res)
            } catch (err) {
                res.status(500).json(err)
            }
        },

        companyLocation: (req, res) => {
            Taxi.validateRates(req.body)
                .then(object => {
                    object = Company.tratmentQuery(object)
                    Help.calculatePointAddress(object)
                        .then(response => Business.create(response)
                            .then(business => Persistence.create(business, res))
                            .catch(err => res.status(400).json(err))
                        )
                        .catch(err => res.status(400).json(err))
                })
                .catch(err => res.status(400).json(err))
        },

        locationCalculateUser: async (req, res) => {
            try {
                
                const returnCityGoogle = await Help.returnCityStateCountry({lat: req.body.clientLat, lng: req.body.clientLng})
                req.body.addressClient = returnCityGoogle.address
                const taxi = await Taxi.validateRates(req.body)
                const object = await Company.tratmentQuery(taxi)
                const calculate = await Help.calculatePointAddress(object)
                const business = await Business.create(calculate, req.body)
                Persistence.create(business, res)
            } catch (err) {
                console.log(err)
                res.status(400).jsno(err)
            }
        },

        listAll: (req, res) => {
            const query = {
                running_delivery_id: {
                    $eq: null
                }
            }
            Persistence.listOneAllWithJoin(query, res)
        },

        listOneCompany: (req, res) => {
            const query = {
                running_delivery_id: null,
                company_id: parseInt(req.params.company_id)
            }
            Persistence.listOneAllWithJoin(query, res)
        },

        refundRequest: (req, res) => {
            if (req.body.typePayment === 3) {
                Business.refundSearch(req.params.id, 3)
                    .then(response => Business.alterStatusRequestDelivery(response)
                        .then(() => Business.calculateVoucher(response)
                            .then(object => res.status(200).json(object))
                            .catch(err => res.status(500).json(err))
                        )
                        .catch(err => res.status(400).json(err))
                    )
                    .catch(err => res.status(400).json(err))
            } else if (req.body.typePayment === 1) {
                Business.refundSearch(req.params.id, 1)
                    .then(response => Business.alterStatusRequestDelivery(response)
                        .then(object => res.status(200).json(object))
                        .catch(err => res.status(400).json(err))
                    )
                    .catch(err => res.status(400).json(err))
            } else if (req.body.typePayment === 2) {
                Business.refundSearch(req.params.id, 2)
                    .then(refund => Business.transaction(refund)
                        .then(response => Business.pagarmeRefund(response)
                            .then(resp => Business.alterStatusRequestDelivery(refund)
                                .then(object => res.status(200).json(object))
                                .catch(err => res.status(400).json(err))
                            )
                            .catch(err => res.status(400).json(err))
                        )
                        .catch(err => res.status(400).json(err))
                    )
                    .catch(err => res.status(400).json(err))
            } else {
                res.status(400).json([{title: 'Tipo de Pagamento', message: 'Error no tipo de pagamento!'}])
            }
        },

        complete: (req, res) => {
            if (req.body.typePayment === 3) {
                Business.extractPoints(req.body)
                    .then(Business.tratmentMultiPoint(req.body))
                    .then(Help.calculatePointAddressMulti)
                    .then(Business.complete(req.body))
                    .then(Business.balanceWithDraw)
                    .then(Business.runningDelivery)
                    .then(Business.bondRequestDelivery)
                    .then(object => {
                        // res.io.emit('runningDelivery', {running: object.running.id})
                        FinancialTransactionBusiness.doLogTransactionDebit(object.running, object.object.company_id)
                        res.status(200).json(object.running)
                    })
                    .catch(err => console.log(err))
            } else if (req.body.typePayment === 1) {
                Business.extractPoints(req.body)
                    .then(Business.tratmentMultiPoint(req.body))
                    .then(Help.calculatePointAddressMulti)
                    .then(Business.complete(req.body))
                    .then(Business.runningDelivery)
                    .then(Business.bondRequestDelivery)
                    .then(resp => {
                        // res.io.emit('runningDelivery', {running: resp.running.id})
                        res.status(200).json(resp.runninng)
                    })
                    .catch(err => res.status(500).json(err))
            } else if (req.body.typePayment === 2) {
                Business.extractPoints(req.body)
                    .then(Business.tratmentMultiPoint(req.body))
                    .then(Help.calculatePointAddressMulti)
                    .then(Business.complete(req.body))
                    .then(Business.listOneCard)
                    .then(Business.prepareTransacionCard)
                    .then(Business.runningDeliveryCard)
                    .then(Business.chargeCard(req))
                    .then(HelpPagarme.returnCardCredit)
                    .then(Business.transactionCard(req.body))
                    .then(resp => {
                        // res.io.emit('runningDelivery', {running: resp.running.id})
                        res.status(200).json(resp.runninng)
                    })
                    .catch(err => res.status(500).json(err))
            } else {
                res.status(400).json({title: 'Tipo de Pagamento', message: 'Error no tipo de pagamento!'})
            }
        },

        deleteCompany: (req, res) => {
            Persistence.deleteWhere({
                where: {
                    $and: [{
                        id: req.body.auxiliary
                    }, {
                        $or: [
                            {company_id: req.body.company_id},
                            {user_id: req.body.user_id}
                        ]
                    }, {
                        running_delivery_id: null
                    }]
                }
            }, res)
        },

        completeUser: async (req, res) => {
            if (req.body.typePayment === 1) {
                Business.extractPoints(req.body)
                    .then(Business.validateNodeObject)
                    .then(Business.tratmentMultiPoint(req.body))
                    .then(Help.calculatePointAddressMulti)
                    .then(Business.runningDeliveryUser(req.body, 2))
                    .then(object => res.status(200).json(object))
                    .catch(err => res.status(500).json(err))
            } else if (req.body.typePayment === 2) {
                try {
                    const extract = await Business.extractPoints(req.body)
                    const validate = await Business.validateNodeObject(extract)
                    const tratmentMultiPoint = await Business.tratmentMultiPoint(req.body)(validate)
                    const calculatePoint = await Help.calculatePointAddressMulti(tratmentMultiPoint)
                    const runningDelivery = await Business.runningDeliveryUser(req.body, 1)(calculatePoint)
                    const listOneCard = await Business.listOneCard(runningDelivery)
                    const listOneUserAddress = await Business.listOneUserAddress(req.body)(listOneCard)
                    const chargeCard = await Business.chargeCardCielo(req)(listOneUserAddress)

                    const returnCard = await HelpCielo.returnTransactionCard(chargeCard)
                    // const returnCard = await HelpPagarme.returnCardCredit(chargeCard)
                    await Business.transactionCardCielo(req.body)(returnCard)
                    if (returnCard.authorizationCode === '05') {
                        runningDelivery.running = 8
                        await RunningDelivery.update({status: 8}, {where: {id: runningDelivery.running.id}})
                    }
                    // res.io.emit('runningDelivery', {running: transactionCard.running.id})
                    res.status(200).json(runningDelivery) 
                } catch (err) {
                    res.status(500).json(err)
                }
            } else {
                res.status(400).json({title: 'Cartão', message: 'Cartão é requerido!'})
            }
        },

        listOne: (req, res) => {
            const query = req.params
            Persistence.listOne(query, res)
        },

        update: (req, res) => {
            const query = req.params
            const mod = {
                map: req.body.map
            }
            Persistence.update(query, mod, res)
        },

        delete: (req, res) => {
            const query = req.params
            Persistence.delete(query, res)
        },

        logDebitFinancialTransact: (req, res, next) => {

            //console.log('O LOG SERÁ GERADO AQUI')

            // //console.log('REQ', req)
            // //console.log('RES', res)
            // next();
        }
    }
}