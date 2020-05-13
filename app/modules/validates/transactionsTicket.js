module.exports = app => {
    const Company = app.datasource.models.Company
    const Errors = require('../../errors/transactions/pt-br')
    const Pagarme = require('../../helpers/pagarme')

    return {
        ticket: (req, res, next) => {
            req.assert('type_transaction_id', Errors.typeTransactionId).notEmpty()
            req.assert('amount', Errors.amountTicket).notEmpty()
            req.assert('company_id', Errors.companyId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Company.findById(req.body.company_id)
                    .then(company => company ? next() : res.status(400).json([Errors.companyNotExist]))
                    .catch(err => res.status(500).json(err))
            }
        },

        listTicketCompany: (req, res, next) => isNaN(req.params.company_id) ? res.status(400).json([Errors.idInvalid]) : next(),

        postBackTicket: (req, res, next) => {
            if (!req.body) {
                res.status(400).json()
            } else {
                const signature = Pagarme.calculateSignature(req.headers['x-hub-signature'], JSON.stringify(req.body))
                const validateSignature = Pagarme.verifySignature(req.headers['x-hub-signature'], JSON.stringify(req.body), signature)
                validateSignature ? next() : res.status(400).json([Errors.invalidPostBack])
            }
        },

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()

    }
}
