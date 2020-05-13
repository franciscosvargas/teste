module.exports = app => {
    const TransactionTicket = app.datasource.models.TransactionTicket

    const Persistence = require('../../helpers/persistence')(TransactionTicket)
    const Business = require('../business/transactionTicket')(app)
    const FinancialTransactionBusiness = require('../business/financialTransaction')(app);

    const RulesCalculate = require('../../helpers/rulesCalculate')(app)

    const Help = require('../../helpers/tratmentPagarme')

    return {
        ticket: async (req, res) => {
            try {
                const ticketObject = {
                    company_id: req.body.company_id,
                    type_transaction_id: req.body.type_transaction_id
                }
                const calculate = await Business.calculate(req.body)
                const company = await Business.listCompany(req.body)
                const ticket = await Business.ticket({object: calculate, company})
                Persistence.create(Help.returnTicket(ticket, ticketObject), res)
            } catch (err) {
                res.status(500).json(err)
            }
        },

        postBackTicket: (req, res) => {
            if (req.body.current_status === 'paid') {
                Business.validation(req.body)
                    .then(object => {
                        RulesCalculate.ticketBalance(object)
                            .then(objectCalculate =>
                                Business.charge(objectCalculate)
                                    .then(object =>
                                        Business.balance(objectCalculate)
                                            .then(() => {
                                                FinancialTransactionBusiness.doLogTransactionCredit(objectCalculate.amount, objectCalculate.company_id, `Inserido crédito via Boleto`)
                                                res.status(200).json()
                                            })
                                            .catch(() => res.status(400).json())
                                    )
                                    .catch(() => res.status(400).json())
                            )
                            .catch(() => res.status(400).json())
                    })
                    .catch(() => res.status(400).json())
            }
        },

        listAll: (req, res) => Persistence.listAllWithJoin(res),

        listTickerCompany: (req, res) => {
            const query = req.params
            Persistence.listOneAllWithJoin(query, res)
        },

        listOne: (req, res) => {
            const query = req.params
            Persistence.listOneWithJoin(query, res)
        },

        listAllCompany: (req, res) => {
            const query = req.params
            Persistence.listOneAllWithJoin(query, res)
        }

    }
}

