module.exports = app => {
    const TransactionCard = app.datasource.models.TransactionCard
    const TransactionTicket = app.datasource.models.TransactionTicket
    const TransactionDeposit = app.datasource.models.TransactionDeposit
    const Company = app.datasource.models.Company
    const Persistence = require('../../helpers/persistence')(TransactionCard)
    const Business = require('../business/transactionCard')(app)
    const FinancialTransactionBusiness = require('../business/financialTransaction')(app)
    const RulesCalculate = require('../../helpers/rulesCalculate')(app)
    const Help = require('../../helpers/tratmentPagarme')

    return {
        card: (req, res) => {
            req.body.customer = Business.customCompany(req.user.object).customer
            Business.calculate(req.body)
                .then(Business.card)
                .then(Help.returnCardCredit)
                .then(resp => Persistence.create(resp.pagarmeReturn, res))
                .catch(err => console.log(err))
        },

        postBackCard: (req, res) => {
            if (req.body.current_status === 'paid') {
                Business.validation(req.body)
                    .then(object =>
                        RulesCalculate.cardBalance(object)
                            .then(objectCalculate =>
                                Business.charge(objectCalculate)
                                    .then(object =>
                                        Business.transaction(objectCalculate)
                                            .then(object =>
                                                Business.balance(objectCalculate)
                                                    .then(balance => {
                                                        FinancialTransactionBusiness.doLogTransactionCredit(objectCalculate.transaction.dataValues.amountNotTax, objectCalculate.company_id, `Inserido crédito via Cartão de Crédito`);
                                                        res.status(200).json()
                                                    })
                                                    .catch(err => res.status(400).json(err))
                                            ).catch(err => res.status(400).json(err))
                                    )
                                    .catch(err => res.status(400).json(err))
                            )
                            .catch(err => res.status(400).json(err))
                    )
                    .catch(err => res.status(400).json(err))
            } else if (req.body.current_status === 'refused') {
                Business.refusedDelivery(req.body)
                    .then(() => res.status(200).json())
                    .catch(() => res.status(400).json())
            }
        },

        postBackCardDelivery: (req, res) => {
            if (req.body.current_status === 'paid') {
                Business.validationDelivery(req.body)
                    .then(object =>
                        RulesCalculate.cardBalance(object)
                            .then(objectCalculate =>
                                Business.cardDeliveryPaid(req.body)
                                    .then(() => {
                                        Business.listOneRunning(req.body)
                                            .then(Business.deviceClientList)
                                            .then(Business.tratmentPushNotificationClient)
                                            .then(() => res.status(200).json())
                                            .catch(() => res.status(400).json())
                                    })
                                    .catch(() => res.status(400).json())
                            )
                            .catch(() => res.status(400).json())
                    )
                    .catch(() => res.status(400).json())
            } else if (req.body.current_status === 'refused') {
                Business.refusedDelivery(req.body)
                    .then(() => {
                        Business.listOneRunning(req.body)
                            .then(Business.deviceClientList)
                            .then(Business.tratmentPushNotificationClientRecused)
                            .then(() => res.status(200).json())
                            .catch(() => res.status(400).json())
                    })
                    .catch(() => res.status(400).json())
            } else if (req.body.current_status === 'refunded') {
                Business.refundDelivery(req.body)
                    .then(() => {
                        Business.listOneRunning(req.body)
                            .then(Business.deviceClientList)
                            .then(Business.tratmentPushNotificationClientRecused)
                            .then(() => res.status(200).json())
                            .catch(() => res.status(400).json())
                    })
                    .catch(() => res.status(400).json())
            }
        },

        postBackCardTaxi: (req, res) => {
            if (req.body.current_status === 'paid') {
                Business.statusTaxi(req.body, 2)
                    .then(() => {
                        Business.listOneRunningTaxi(req.body)
                            .then(Business.deviceClientList)
                            .then(Business.tratmentPushNotificationClient)
                            .then(() => res.status(200).json())
                            .catch(err => console.log(err))
                    })
                    .catch(() => res.status(400).json())
            } else if (req.body.current_status === 'refused') {
                Business.statusTaxi(req.body, 8)
                    .then(() => {
                        Business.listOneRunningTaxi(req.body)
                            .then(Business.deviceClientList)
                            .then(Business.debitUser)
                            .then(Business.tratmentPushNotificationClientRecused)
                            .then(() => res.status(200).json())
                            .catch(() => res.status(400).json())
                    })
                    .catch(() => res.status(400).json())
            } else if (req.body.current_status === 'refunded') {
                Business.statusTaxi(req.body, 9)
                    .then(() => {
                        Business.listOneRunningTaxi(req.body)
                            .then(Business.deviceClientList)
                            .then(Business.tratmentPushNotificationClientRecused)
                            .then(() => res.status(200).json())
                            .catch(() => res.status(400).json())
                    })
                    .catch(() => res.status(400).json())
            }
        },

        listAll: (req, res) => {
            Persistence.listAll(res)
        },

        listOne: (req, res) => {
            const query = req.params
            Persistence.listOneWithJoin(query, res)
        },

        listAllCompany: (req, res) => {
            const query = req.params
            Persistence.listOneAllWithJoin(query, res)
        },

        taxiNewPagarme: (req, res) => {
            if (req.body.current_status === 'paid') {
                Business.statusTaxiFinish(req.body, 6)
                    .then(() => {
                        Business.listOneRunningTaxiFinish(req.body)
                            .then(Business.deviceClientList)
                            .then(Business.tratmentPushNotificationClient)
                            .then(() => res.status(200).json())
                            .catch(err => console.log(err))
                    })
                    .catch(() => res.status(400).json())
            } else if (req.body.current_status === 'refused') {
                Business.statusTaxiFinish(req.body, 8)
                    .then(() => {
                        Business.listOneRunningTaxiFinish(req.body)
                            .then(Business.deviceClientList)
                            .then(Business.tratmentPushNotificationClient)
                            .then(() => res.status(200).json())
                            .catch(err => console.log(err))
                    })
                    .catch(() => res.status(400).json())
            } else if (req.body.current_status === 'refunded') {
                Business.statusTaxiFinish(req.body, 8)
                    .then(() => {
                        Business.listOneRunningTaxiFinish(req.body)
                            .then(Business.deviceClientList)
                            .then(Business.tratmentPushNotificationClient)
                            .then(() => res.status(200).json())
                            .catch(err => console.log(err))
                    })
                    .catch(() => res.status(400).json())
            }
        },

        ticketPagarme: (req, res) => {
            
        },
        allTransaction: (req, res) => {
            const query = {
                where: {
                    id: req.params.company_id,
                    include: [
                        {model: TransactionCard, where: {company_id: req.params.company_id}},
                        {model: TransactionTicket, where: {company_id: req.params.company_id}},
                        {model: TransactionDeposit, where: {company_id: req.params.company_id}}
                    ]
                }
            }

            Company.findAll(query)
                .then(resp => res.json(resp))
                .catch(err => res.status(500).json(err))
        }
    }
}
