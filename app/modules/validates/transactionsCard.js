module.exports = app => {
    const Company = app.datasource.models.Company
    const Card = app.datasource.models.Card

    const TransactionCard = app.datasource.models.TransactionCard

    const Pagarme = require('../../helpers/pagarme')

    const Errors = require('../../errors/transactionCard/pt-br')

    return {
        card: (req, res, next) => {
            req.assert('card_id', Errors.cardId).notEmpty()
            req.assert('company_id', Errors.companyId).notEmpty()
            req.assert('amount', Errors.amount).notEmpty()
            req.assert('type_transaction_id', Errors.typeTransactionId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                const query = { where: { id: req.body.company_id }, include: { all: true } }
                Company.findOne(query)
                    .then(company => {
                        if (company) {
                            Card.findById(req.body.card_id)
                                .then(card => {
                                    if (card) {
                                        req.body.card = card.dataValues
                                        next()
                                    } else {
                                        res.status(400).json([Errors.cardNotExist])
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
        postBackCard: (req, res, next) => {
            if (!req.body) {
                res.status(400).json()
            } else {
                const signature = Pagarme.calculateSignature(req.headers['x-hub-signature'], JSON.stringify(req.body))
                const validateSignature = Pagarme.verifySignature(req.headers['x-hub-signature'], JSON.stringify(req.body), signature)
                validateSignature ? next() : res.status(400).json([Errors.invalidPostBack])
            }
        },

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        reversal: (req, res, next) => {
            req.assert('company_id', Errors.companyId).notEmpty()
            const error = req.validationErrors()
            if (!isNaN(req.params.id)) {
                if (error) {
                    res.status(400).json(error)
                } else {
                    const query = { where: { $and: [{ id: req.params.id }, { company_id: req.body.company_id }] }, include: { all: true } }

                    TransactionCard.findOne(query)
                        .then(transactionCard => {
                            if (transactionCard) {
                                req.body.transactionCard = transactionCard.dataValues
                                next()
                            } else {
                                res.status(400).json([Errors.transactionCardNotExist])
                            }
                        })
                        .catch(err => res.status(500).json(err))
                }
            } else {
                res.status(400).json([Errors.idInvalid])
            }
        }
    }
}
