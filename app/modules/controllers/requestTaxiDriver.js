module.exports = app => {
    const RequestTaxiDriver = app.datasource.models.RequestTaxiDriver
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const Persistence = require('../../helpers/persistence')(RequestTaxiDriver)

    const RunnigHelp = require('../../helpers/running')(app)
    const Business = require('../business/taxi')(app)
    const Help = require('../../helpers/googleMaps')

    const HelpCielo = require('../../helpers/tratmentCielo')

    return {
        create: eventEmitter => async (req, res) => {
            if (req.body.typePayment === 1) {
                const rates = await Business.validateRates(req.body)
                const calculate = await Business.calculateTaximeter(rates)
                const helpsCal = await Help.calculatePointAddressTaxi(calculate)
                const requestTaxi = await Business.requestTaxi(req.body)(helpsCal)
                const request = await Business.createRequest1(req.body)(requestTaxi)
                const running = await RunnigHelp.runningCreate(req.body, 2)(request)
                const updateRequest = await RunnigHelp.updateRequest(running)
                const obj = await RunnigHelp.tratmentObjectReturn(updateRequest)

                const query = {where: {id: {$eq: obj.id}}, include: {all: true}}
                RunningTaxiDriver.findOne(query)
                    .then((res) => {
                        if (res) {
                            eventEmitter.emit('provider-ride-new', res.dataValues)
                        }
                    })
                    .catch(() => {
                    })

                res.status(200).json(obj)

                // Business.validateRates(req.body)
                //     .then(Business.calculateTaximeter)
                //     .then(Help.calculatePointAddressTaxi)
                //     .then(Business.requestTaxi(req.body))
                //     .then(Business.createRequest1(req.body))
                //     .then(RunnigHelp.runningCreate(req.body, 2))
                //     .then(RunnigHelp.updateRequest)
                //     .then(RunnigHelp.tratmentObjectReturn)
                //     .then(resp => {
                //         // eventEmitter.emit('provider-ride-new', resp)
                //         res.status(200).json(resp)
                //     })
                //     .catch(err => res.status(400).json(err))
            } else if (req.body.typePayment === 2) {
                try {
                    const rates = await Business.validateRates(req.body)
                    const calculate = await Business.calculateTaximeter(rates)
                    const helpsCal = await Help.calculatePointAddressTaxi(calculate)
                    const requestTaxi = await Business.requestTaxi(req.body)(helpsCal)
                    const businessQuery = Business.queryCreateRequest(requestTaxi, req.body)
                    const createRequestCard = await Business.createRequestCard(businessQuery)
                    const cardListOne = await Business.cardListOne(req.body)(createRequestCard)
                    const listOneUser = await Business.listOneUser(cardListOne)
                    const createRunning = await Business.crateRunningTaxi(req.body)(listOneUser)

                    if (parseFloat(createRunning.running.value) > 0) {
                        const transactionCardCielo = await Business.transactionCardCielo(createRunning)
                        const returnCard = await HelpCielo.returnTransactionCard(transactionCardCielo)
                        const transactionTratmentCielo = await Business.transactionTratmentCielo(createRunning, returnCard)
                        const requestTaxiUpdate = await Business.requestTaxiUpdateCielo(transactionTratmentCielo)
                        const runningUpdate = await Business.runningUpdateCielo(requestTaxiUpdate)
                        const tratmentObjectReturnCard = await RunnigHelp.tratmentObjectReturnCard(runningUpdate, req.user.object)
                        res.status(201).json(tratmentObjectReturnCard)
                    }
                    // const runningUpdate = await Business.runningUpdateCielo(createRunning)
                    // const tratmentObjectReturnCard = await RunnigHelp.tratmentObjectReturnCard(runningUpdate)
                    // res.status(201).json(tratmentObjectReturnCard)
                } catch (err) {
                    console.log(err)
                    res.status(500).json(err)
                }
            } else {
                res.status(400).json({title: 'Tipo de pagamento', message: 'Tipo de Pagamento Invalido!'})
            }
        },
        update: (req, res) => Persistence.update(req.params, req.body, res),
        listOne: (req, res) => Persistence.listOneWithJoin(req.params, res),
        listAll: (req, res) => Persistence.listAllWithJoin(res),
        delete: (req, res) => Persistence.delete(req.params, res)
    }
}
