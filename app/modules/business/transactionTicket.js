module.exports = app => {
    const Pagarme = require('../../helpers/pagarme')
    const Help = require('../../helpers/tratmentPagarme')

    const TypeTransaction = app.datasource.models.TypeTransaction
    const Company = app.datasource.models.Company
    const TransactionTicket = app.datasource.models.TransactionTicket

    const Transactions = app.datasource.models.Transactions

    return {
        ticket: (object) => {
            const objectPagarme = Help.ticket(object)
            return Pagarme.ticket(objectPagarme).then(Help.returnPagarme)
        },
        calculate: (object) => new Promise((resolve, reject) => {
            TypeTransaction.findById(object.type_transaction_id)
                .then(transaction => {
                    if (transaction) {
                        object.amount = parseInt(object.amount) + (parseFloat(transaction.dataValues.rate.replace(',', '.')) * 100)
                        resolve(object)
                    } else {
                        reject({title: 'Transação', message: 'Transação não existe!'})
                    }
                })
                .catch(reject)
        }),
        listCompany: object => {
            return Company.findOne({
                where: {
                    id: object.company_id
                }, 
                include: {all: true}
            })
        },
        validation: (object) => {
            return new Promise((resolve, reject) => {
                const responsePagarmeObject = Help.postBackTicket(object)
                const query = {
                    where: {
                        $and: [
                            { company_id: responsePagarmeObject.company_id },
                            { pagarmeId: responsePagarmeObject.pagarmeId },
                            { status: { $ne: 'paid' } },
                            { fingerprint: null }
                        ]
                    },
                    include: { all: true }
                }
                TransactionTicket.findOne(query)
                    .then(typeTransaction => {
                        if (typeTransaction) {
                            responsePagarmeObject.TypeTransaction = typeTransaction.TypeTransaction.dataValues
                            responsePagarmeObject.transaction = typeTransaction
                            resolve(responsePagarmeObject)
                        } else {
                            throw new Error('Transaction not exist!')
                        }
                    })
                    .catch(err => reject(err))
            })
        },

        charge: (object) => {
            return new Promise((resolve, reject) => {
                const query = {where: {pagarmeId: object.pagarmeId}}
                const mod = {
                    fingerprint: object.fingerprint,
                    currentStatus: object.currentStatus,
                    authorizedAmount: object.authorizedAmount,
                    cost: object.cost,
                    cardHoldName: object.cardHoldName,
                    cardLastDigits: object.cardLastDigits,
                    cardBrand: object.cardBrand,
                    cardPinMode: object.cardPinMode,
                    status: object.currentStatus
                }
                TransactionTicket.update(mod, query)
                    .then(typeTransaction => resolve(object))
                    .catch(err => reject(err))
            })
        },

        transaction: (object) => {
            const mod = {
                balance: object.amount,
                company_id: object.company_id,
                transaction_ticket_id: object.transaction.id,
                authorizedAmount: object.authorizedAmount
            }
            return new Promise((resolve, reject) => {
                Transactions.create(mod)
                    .then(transaction => resolve(transaction))
                    .catch(err => reject(err))
            })
        },

        balance: (object) => {
            return new Promise((resolve, reject) => {
                Company.increment(['balance'], {by: parseFloat(object.amount), where: {id: object.company_id}})
                    .then(company => resolve(company))
                    .catch(err => reject(err))
            })
        }
    }
}
