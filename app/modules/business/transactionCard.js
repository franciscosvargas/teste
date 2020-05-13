module.exports = app => {
    const TransactionCard = app.datasource.models.TransactionCard
    const TypeTransaction = app.datasource.models.TypeTransaction
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const DebitUserRunning = app.datasource.models.DebitUserRunning
    const Devices = app.datasource.models.Devices

    const Transactions = app.datasource.models.Transactions

    const Company = app.datasource.models.Company

    const Help = require('../../helpers/tratmentPagarme')

    const Pagarme = require('../../helpers/pagarme')

    const Onesignal = require('../../helpers/oneSignal')

    const verifyUpdate = (object, resolve, reject) => {
        if (!object[0]) {
            reject({
                title: 'Error em alterar!',
                message: 'Não foi possivel efetuar atualização, tente novamente!'
            })
        } else {
            resolve(object)
        }
    }

    return {
        card: (object) => new Promise(async (resolve, reject) => {
            try {
                const objectPagarme = Help.cardCredit(object)
                const pagarme = await Pagarme.cardCredit(objectPagarme)
                const returnPagarme = await Help.returnPagarme(pagarme)
                resolve(
                    Object.assign({pagarme: returnPagarme}, object)
                )
            } catch (err) {
                reject(err)
            }
        }),
        cardTransaction: cardObject => pagarme => new Promise((resolve, reject) => {
            try {
                cardObject.pagarme = pagarme
                resolve(cardObject)
            } catch (err) {
                reject(err)
            }
        }),
        calculate: (object) => {
            return new Promise((resolve, reject) => {
                TypeTransaction.findById(object.type_transaction_id)
                    .then(transaction => {
                        const percent = parseFloat(transaction.dataValues.percent.replace(',', '.'))
                        object.amount = parseInt(object.amount)
                        object.amount = ((object.amount + (object.amount * (percent / 100))) / 100).toFixed(2).replace('.', '')
                        resolve(object)
                    })
                    .catch(err => reject(err))
            })
        },

        validation: (object) => {
            return new Promise((resolve, reject) => {
                const responsePagarmeObject = Help.postBackCardCredit(object)
                const query = {
                    where: {
                        $and: [
                            {
                                $or: [{company_id: responsePagarmeObject.company_id}, {user_id: responsePagarmeObject.user_id}]
                            },
                            {
                                pagarmeId: responsePagarmeObject.pagarmeId
                            },
                            {
                                status: {
                                    $ne: 'paid'
                                }
                            },
                            {
                                fingerprint: null
                            }
                        ]
                    },
                    include: {
                        all: true
                    }
                }
                TransactionCard.findOne(query)
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

        validationDelivery: (object) => {
            return new Promise((resolve, reject) => {
                const responsePagarmeObject = Help.postBackCardCreditTransaction(object)
                const query = {
                    where: {
                        $and: [{
                            $or: [{company_id: responsePagarmeObject.company_id}, {user_id: responsePagarmeObject.user_id}]
                        },
                        {
                            pagarmeId: responsePagarmeObject.pagarmeId
                        },
                        {
                            status: {
                                $ne: 'paid'
                            }
                        },
                        {
                            fingerprint: null
                        }
                        ]
                    },
                    include: {
                        all: true
                    }
                }
                TransactionCard.findOne(query)
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

        listOneRunning: object => {
            const responsePagarmeObject = Help.postBackCardCreditTransaction(object)
            return RunningDelivery.findOne({
                where: {
                    id: responsePagarmeObject.running_delivery_id
                },
                include: {all: true}
            })
        },

        listOneRunningTaxiFinish: object => {
            return RunningTaxiDriver.findOne({
                where: {
                    id: object.transaction.metadata.running_taxi_id
                },
                include: {all: true}
            })
        },

        listOneRunningTaxi: object => {
            const responsePagarmeObject = Help.postBackCardCreditTransaction(object)
            return RunningTaxiDriver.findOne({
                where: {
                    id: responsePagarmeObject.running_taxi
                },
                include: {all: true}
            })
        },


        debitUser: object => new Promise((resolve, reject) => {
            if (object) {
                DebitUserRunning.create({
                    user_id: object.running.user_id,
                    running_taxi_driver_id: object.running.id
                })
                    .then(() => resolve(object))
                    .catch(() => reject())
            } else {
                reject()
            }
        }),
        deviceClientList: object => new Promise((resolve, reject) => {
            if (object) {
                Devices.findOne({where: {user_id: object.dataValues.user_id}}, {raw: true})
                    .then(device => resolve(Object.assign({device: device, running: object.dataValues}, {})))
                    .catch(reject)
            } else {
                reject()
            }
        }),

        tratmentPushNotificationClient: object => new Promise((resolve, reject) => {
            if (object.device) {
                try {
                    const push = {
                        message: {
                            'en': 'Pagamento Efetuado com Sucesso!'
                        },
                        running: {
                            running_id: object.running.id,
                            cancel: false,
                            title: 'Pagamento Efetuado com Sucesso!',
                            message: 'Pagamento Efetuado com Sucesso!'
                        },
                        playerId: [object.device.tokenGcm]
                    }
                    Onesignal.pushNotification(push)
                        .then(() => resolve(object))
                        .catch(() => resolve(object))
                } catch (err) {
                    console.log(err)
                }
            } else {
                resolve()
            }
        }),

        tratmentPushNotificationClientRecused: object => new Promise((resolve, reject) => {
            if (object.device) {
                try {
                    const push = {
                        message: {
                            'en': 'Pagamento Recusado!'
                        },
                        running: {
                            running_id: object.running.id,
                            cancel: false,
                            title: 'Pagamento Recusado!',
                            message: 'Pagamento Recusado!'
                        },
                        playerId: [object.device.tokenGcm]
                    }
                    Onesignal.pushNotification(push)
                        .then(() => resolve(object))
                        .catch(() => resolve(object))
                } catch (err) {
                    console.log(err)
                }
            } else {
                resolve()
            }
        }),

        cardDeliveryPaid: (object) => {
            const responsePagarmeObject = Help.postBackCardCreditTransaction(object)
            const queryCard = {
                where: {
                    $and: [
                        {
                            $or: [{company_id: responsePagarmeObject.company_id}, {user_id: responsePagarmeObject.user_id}]
                        },
                        {
                            pagarmeId: responsePagarmeObject.pagarmeId
                        },
                        {
                            status: {
                                $ne: 'paid'
                            }
                        },
                        {
                            fingerprint: null
                        }
                    ]
                }
            }

            const modCard = {
                status: responsePagarmeObject.status
            }
            return new Promise((resolve, reject) => {
                const query = {
                    where: {id: responsePagarmeObject.running_delivery_id}
                }
                const mod = {
                    status: 2
                }
                RunningDelivery.update(mod, query)
                    .then(RunningDelivery => {
                        TransactionCard.update(modCard, queryCard)
                            .then(transactionCard => verifyUpdate(RunningDelivery, resolve, reject))
                            .catch(reject)
                    })
                    .catch(reject)
            })
        },
        charge: (object) => {
            return new Promise((resolve, reject) => {
                const query = {
                    where: {
                        pagarmeId: object.pagarmeId
                    }
                }
                const mod = {
                    fingerprint: object.fingerprint,
                    authorizedAmount: object.authorizedAmount,
                    cost: object.cost,
                    cardHoldName: object.cardHoldName,
                    cardLastDigits: object.cardLastDigits,
                    cardBrand: object.cardBrand,
                    cardPinMode: object.cardPinMode,
                    status: object.status
                }
                TransactionCard.update(mod, query)
                    .then(typeTransaction => resolve(typeTransaction))
                    .catch(err => reject(err))
            })
        },

        transaction: (object) => {
            const mod = {
                balance: object.amount,
                company_id: object.company_id,
                transaction_card_id: object.transaction.dataValues.id,
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
                Company.increment(['balance'], {
                    by: parseFloat(object.transaction.dataValues.amountNotTax),
                    where: {
                        id: object.company_id
                    }
                })
                    .then(company => resolve(company))
                    .catch(err => reject(err))
            })
        },

        refundDelivery: object => new Promise((resolve, reject) => {
            try {
                const responsePagarmeObject = Help.postBackCardCreditTransaction(object)
                const queryCard = {
                    where: {
                        $and: [{
                            $or: [{company_id: responsePagarmeObject.company_id}, {user_id: responsePagarmeObject.user_id}]
                        },
                        {
                            pagarmeId: responsePagarmeObject.pagarmeId
                        },
                        {
                            status: {
                                $eq: 'paid'
                            }
                        }
                        ]
                    }
                }
                const modCard = {
                    status: responsePagarmeObject.status
                }
                TransactionCard.update(modCard, queryCard)
                    .then(resolve)
                    .catch(reject)
            } catch (err) {
                //console.log(err)
            }
        }),
        refusedDelivery: (object) => {
            const responsePagarmeObject = Help.postBackCardCreditTransaction(object)
            const queryCard = {
                where: {
                    $and: [{
                        $or: [{company_id: responsePagarmeObject.company_id}, {user_id: responsePagarmeObject.user_id}]
                    },
                    {
                        pagarmeId: responsePagarmeObject.pagarmeId
                    },
                    {
                        status: {
                            $ne: 'paid'
                        }
                    },
                    {
                        fingerprint: null
                    }
                    ]
                }
            }
            const modCard = {
                status: responsePagarmeObject.status
            }
            return new Promise((resolve, reject) => {
                const query = {
                    where: {id: responsePagarmeObject.running_delivery_id}
                }
                const mod = {
                    status: 8
                }
                RunningDelivery.update(mod, query)
                    .then(RunningDelivery => {
                        TransactionCard.update(modCard, queryCard)
                            .then(transactionCard => verifyUpdate(RunningDelivery, resolve, reject))
                            .catch(reject)
                    })
                    .catch(reject)
            })
        },
        statusTaxi: (object, status) => new Promise((resolve, reject) => {
            const queryRunngin = {
                where: {
                    $and: [
                        {user_id: object.transaction.metadata.user_id},
                        {id: object.transaction.metadata.running_taxi}
                    ]
                }
            }
            const modRunning = {
                status: status
            }
            const query = {
                where: {
                    $and: [
                        {pagarmeId: object.id},
                        {
                            status: {
                                $ne: 'paid'
                            }
                        }
                    ]
                }
            }
            const mod = {
                status: object.current_status
            }
            TransactionCard.update(mod, query)
                .then((request) => {
                    RunningTaxiDriver.update(modRunning, queryRunngin)
                        .then(runningTaxiDriver => verifyUpdate(runningTaxiDriver, resolve, reject))
                        .catch(reject)
                }).catch(reject)
        }),
        statusTaxiFinish: (object, status) => new Promise((resolve, reject) => {
            const queryRunngin = {
                where: {
                    id: object.transaction.metadata.running_taxi_id
                }
            }
            const modRunning = {
                status: status
            }
            const query = {
                where: {
                    $and: [
                        {pagarmeId: object.id},
                        {
                            status: {
                                $ne: 'paid'
                            }
                        }
                    ]
                }
            }
            const mod = {
                status: object.current_status
            }
            TransactionCard.update(mod, query)
                .then((request) => {
                    RunningTaxiDriver.update(modRunning, queryRunngin)
                        .then(runningTaxiDriver => verifyUpdate(runningTaxiDriver, resolve, reject))
                        .catch(reject)
                }).catch(reject)
        }),
        refuse: (object, res) => {
            const responsePagarmeObject = Help.postBackCardCredit(object)
            const query = {
                where: {
                    $and: [{
                        company_id: responsePagarmeObject.company_id || null
                    },
                    {
                        user_id: responsePagarmeObject.user_id || null
                    },
                    {
                        pagarmeId: responsePagarmeObject.pagarmeId
                    },
                    {
                        status: {
                            $ne: 'paid'
                        }
                    },
                    {
                        fingerprint: null
                    }
                    ]
                }
            }

            const mod = {
                status: responsePagarmeObject.status
            }

            return new Promise((resolve, reject) => {
                TransactionCard.update(mod, query)
                    .then(transactionCard => verifyUpdate(transactionCard, resolve, reject))
                    .catch(reject)
            })
        },

        reversal: (object) => {

        },
        customCompany: (object) => ({
            customer: {
                email: object.email,
                name: object.name,
                document_number: object.Companies[0].cnpj,
                address: {
                    zipcode: object.Companies[0].dataValues.zipCode,
                    neighborhood: object.Companies[0].dataValues.district,
                    street: object.Companies[0].dataValues.address,
                    street_number: object.Companies[0].dataValues.number
                },
                phone: {
                    number: `${object.number}`,
                    ddd: `${object.ddd}`
                }
            }
        })

    }
}
