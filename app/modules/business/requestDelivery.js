module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')
    const Company = app.datasource.models.Company
    const Card = app.datasource.models.Card
    const Address = app.datasource.models.Address
    const TransactionCard = app.datasource.models.TransactionCard
    const RunningDelivery = app.datasource.models.RunningDelivery
    const AddressClient = app.datasource.models.AddressClient
    const RequestDelivery = app.datasource.models.RequestDelivery
    const TransactionCardCielo = app.datasource.models.TransactionCardCielo

    const Regex = require('../../helpers/regex')

    const url = require('../../config/key').pagarme

    const Help = require('../../helpers/tratmentPagarme')

    const Pagarme = require('../../helpers/pagarme')

    const Cielo = require('../../helpers/cielo')

    const toDebitCompany = (company, valueTotal) => (parseFloat(company.balance) - parseFloat(valueTotal))

    const verifyUpdate = (object, resolve, reject, body) => {
        if (!object[0]) {
            reject({
                title: 'Error em alterar!',
                message: 'Não foi possivel efetuar atualização, tente novamente!'
            })
        } else {
            resolve(body)
        }
    }


    const verifyObjectAddress = (address, resolve, reject, object) => (address)
        ? resolve(Object.assign({ address: address }, object))
        : reject({ title: 'Error', message: 'Endereço não existe!' })

    const verifyObject = (object, resolve, reject) => object ? resolve(object) : reject({
        title: 'Error',
        message: 'Transação não existe!'
    })

    return {
        create: (object, body) => {
            return new Promise((resolve, reject) => {
                try {
                    object.pointInit = {
                        type: 'Point',
                        // coordinates: object.pointFinish
                        coordinates: object.pointInit
                    }
                    object.pointFinish = {
                        type: 'Point',
                        // coordinates: object.pointInit
                        coordinates: object.pointFinish
                    }
                    object.originAddresses = body.originName || object.originAddresses[0]
                    object.destinationAddresses = body.destinyName || object.destinationAddresses[0]
                    resolve(object)
                } catch (err) {
                    reject({
                        title: 'Error',
                        message: 'Tratment Point location request'
                    })
                }
            })
        },
        complete: (body) => (object) => new Promise((resolve, reject) => {
            let valueTotal = 0.0
            object.calculate.map((calculate, index) => {
                if (index > 0) {
                    valueTotal += parseFloat(calculate.valueTotal) - 1
                } else {
                    valueTotal += parseFloat(calculate.valueTotal)
                }
            })
            object.calculate[0].sumTotal = valueTotal
            console.log(object.calculate[0].sumTotal)

            const query = {
                where: {
                    balance: {
                        $gte: valueTotal.toFixed(2)
                    }
                }
            }
            if (body.typePayment === 3) {
                Company.findOne(query)
                    .then(company => company ? resolve(object) : errorBalance(reject))
                    .catch(() => reject({
                        title: 'Empresa',
                        message: 'Empresa não possui saldo!'
                    }))
            } else {
                resolve(object)
            }
        }),
        runningDelivery: object => new Promise((resolve, reject) => {
            RunningDelivery.create({
                value: object.calculate[0].sumTotal,
                status: 2,
                free: false,
                typePayment: object.typePayment,
                service_id: object.service_id,
                freeDriver: object.calculate[0].requestReturn,
                company_id: object.company_id || null,
                user_id: object.user_id || null
            }, { raw: true })
                .then(running => resolve(Object.assign({ running: running, object: object }, {})))
                .catch(reject)
        }),
        bondRequestDelivery: object => new Promise(async (resolve, reject) => {
            try {
                const query = {
                    where: {
                        $and: [{
                            id: object.object.auxiliary
                        },
                        {
                            $or: [{ company_id: object.object.company_id }, { user_id: object.object.user_id }]
                        }
                        ]
                    }
                }
                let result = parseFloat(object.object.calculate[0].sumTotal) / parseInt(object.object.auxiliary.length)
                await RequestDelivery.update({ valueTotalNew: result }, query)

                const mod = {
                    running_delivery_id: object.running.id,
                    typePayment: object.object.typePayment
                }
                await RequestDelivery.update(mod, query)
                resolve(object)
            } catch (err) {
                reject(err)
            }
        }),
        runningDeliveryUser: (body, status) => object => new Promise((resolve, reject) => {
            RunningDelivery.create({
                value: object.request[0].valueTotal,
                status: status,
                free: true,
                percentCard: status === 1 ? 0.10 : 0.0,
                service_id: body.service_id,
                typePayment: body.typePayment,
                user_id: body.user_id
            }, { raw: true })
                .then(runing => {
                    const query = {
                        where: {
                            $and: [{
                                id: object.auxiliary
                            },
                            {
                                user_id: body.user_id
                            }
                            ]
                        }
                    }
                    const mod = {
                        running_delivery_id: runing.id,
                        typePayment: body.typePayment,
                        map: body.map,
                        valueTotalNew: object.request[0].valueTotal
                    }
                    RequestDelivery.update(mod, query)
                        .then(() => resolve(Object.assign({ object: object, running: runing }), {}))
                        .catch(reject)
                })
                .catch(reject)
        }),
        runningDeliveryCard: object => new Promise((resolve, reject) => {
            RunningDelivery.create({
                value: object.calculate[0].sumTotal,
                status: 1,
                percentCard: object.calculate[0].sumTotal * 0.10,
                typePayment: object.object.typePayment,
                service_id: object.object.service_id,
                freeDriver: object.object.calculate[0].requestReturn,
                company_id: object.object.company_id || null,
                user_id: object.object.user_id || null,
                card_id: object.card.id
            }, { raw: true })
                .then(running => resolve(Object.assign({ running: running }, object)))
                .catch(reject)
        }),

        runningDeliveryUserCard: (object, body, card) => {
            const mod = {
                value: object.request[0].valueTotal,
                percentCard: object.calculate[0].sumTotal * 0.10,
                status: 1,
                typePayment: body.typePayment,
                user_id: object.user_id || null,
                service_id: body.service_id,
                card_id: card.id
            }
            return new Promise((resolve, reject) => {
                RunningDelivery.create(mod)
                    .then(runing => {
                        const query = {
                            where: {
                                $and: [{
                                    id: object.auxiliary
                                },
                                {
                                    user_id: body.user_id
                                }
                                ]
                            }
                        }
                        const mod = {
                            running_delivery_id: runing.id
                        }
                        RequestDelivery.update(mod, query)
                            .then(() => resolve(runing))
                            .catch(reject)
                    })
                    .catch(reject)
            })
        },

        balanceWithDraw: object => {
            return new Promise((resolve, reject) => {
                Company.findById(object.company_id, { raw: true })
                    .then(company => {
                        const balance = toDebitCompany(company, object.calculate[0].sumTotal)
                        if (balance > 0) {
                            const query = {
                                where: {
                                    id: object.company_id
                                }
                            }
                            const mod = {
                                balance: balance
                            }
                            Company.update(mod, query)
                                .then(update => verifyUpdate(update, resolve, reject, object))
                                .catch(reject)
                        } else {
                            reject({
                                title: 'Saldo',
                                message: 'Saldo Insuficiente!'
                            })
                        }
                    })
                    .catch(reject)
            })
        },

        extractPoints: (objectRequest) => {
            objectRequest.finish = []
            objectRequest.init = []
            console.log('extractPoints')
            return new Promise((resolve, reject) => {
                try {
                    objectRequest.init = `${objectRequest.request[0].dataValues.pointInit.coordinates[0]}, ${objectRequest.request[0].dataValues.pointInit.coordinates[1]}`
                    objectRequest.request.map((point) => {
                        objectRequest.finish.push(`${point.dataValues.pointFinish.coordinates[0]}, ${point.dataValues.pointFinish.coordinates[1]}`)
                    })
                    resolve(objectRequest)
                } catch (err) {
                    reject({
                        title: 'Error',
                        message: 'Tratment Point location request'
                    })
                }
            })
        },

        addClient: (object) => AddressClient.findById(object.address_client_id, { raw: true }),

        validateNodeObject: (object) => new Promise((resolve, reject) => {

            try {
                object.add = 0.0
                object.repeat = []
                let test = null
                object.request.map((element, index) => {
                    if (test === null) {
                        test = element
                    } else {
                        test = element
                    }
                })
                resolve(object)
            } catch (err) {
                reject({
                    title: 'Error',
                    message: 'Error em processar informações!'
                })
            }
        }),
        listOneCard: (object) => new Promise((resolve, reject) => {
            const query = {
                where: {
                    cardId: object.object.card_id
                },
                raw: true
            }
            Card.findOne(query)
                .then(card => card ? resolve(Object.assign({ card: card }, object)) : reject({ title: 'Error', message: 'Cartão não existe!' }))
                .catch(reject)
        }),
        listOneUserAddress: body => object => new Promise((resolve, reject) => {
            const query = {
                where: {
                    user_id: body.user_id
                },
                raw: true
            }
            Address.findOne(query)
                .then(address => verifyObjectAddress(address, resolve, reject, object))
                .catch(reject)
        }),

        prepareTransacionCard: object => new Promise((resolve, reject) => {
            resolve(Object.assign({
                cardTransaction: {
                    request: object.object.auxiliary,
                    company_id: object.object.company_id || null,
                    user_id: object.object.user_id || null,
                    type_transaction_id: object.object.type_transaction_id,
                    amountNotTax: object.calculate[0].sumTotal,
                    id: object.cards.id
                },
                object
            }))
        }),

        chargeCardCielo: req => async object => 
            Cielo.transactionCard({
                MerchantOrderId: object.running.id,
                Customer: {
                    Name: req.user.object.name
                },
                Payment: {
                    Type: "CreditCard",
                    Amount: Regex.clean((object.object.calculate[0].valueTotal * 1.10).toFixed(2)),
                    Installments: 1,
                    SoftDescriptor: object.running.id,
                    CreditCard: {
                        CardToken: object.card.cardId,
                        SecurityCode: object.card.cardCvv,
                        Brand: object.card.brand === 'master-card' ? 'Master' 
                        : object.card.brand === 'maestro' ? 'Elo' 
                        : object.card.brand === 'diners-club' ? 'Diners' : object.card.brand
                    }
                }
            }),

        chargeCard: req => object => new Promise((resolve, reject) => {
            const valueAmount = (object.object.calculate[0].valueTotal * 1.10).toFixed(2)
            Pagarme.cardCredit({
                amount: Regex.clean(valueAmount),
                card_id: object.card.cardId,
                cvv: object.card.cardCvv,
                payment_method: 'credit_card',
                postback_url: url.cardDeliveryPostBacnkUrl,
                customer: {
                    name: req.user.object.name,
                    email: req.user.object.email,
                    document_number: req.user.object.cpf,
                    address: {
                        street: object.address.address,
                        street_number: object.address.number,
                        neighborhood: object.address.district,
                        zipcode: object.address.zipCode
                    },
                    phone: {
                        ddi: `+${req.user.object.ddi}`,
                        ddd: req.user.object.ddd.toString(),
                        number: req.user.object.number.toString()
                    }
                },
                metadata: {
                    running_delivery_id: object.running.id,
                    company_id: req.body.company_id || null,
                    user_id: req.body.user_id || null

                }
            })
                .then(Help.returnPagarme)
                .then(pagarme => resolve(Object.assign({ pagarme: pagarme }, object)))
                .catch(reject)
        }),
        chargeUserCard: (card, body, running, address) => {
            const object = {
                amount: Regex.clean((body.request[0].valueTotal * 1.10).toString()),
                card_id: card.cardId,
                card_cvv: card.cardCvv,
                payment_method: 'credit_card',
                postback_url: url.cardDeliveryPostBacnkUrl,
                customer: {
                    name: address.dataValues.User.dataValues.name,
                    email: address.dataValues.User.dataValues.email,
                    document_number: address.dataValues.User.dataValues.cpf,
                    address: {
                        street: address.dataValues.address,
                        street_number: address.dataValues.number,
                        neighborhood: address.dataValues.district,
                        zipcode: address.dataValues.zipCode
                    },
                    phone: {
                        ddi: `+${address.dataValues.User.dataValues.ddi}`,
                        ddd: address.dataValues.User.dataValues.ddd.toString(),
                        number: address.dataValues.User.dataValues.number.toString()
                    }
                },
                metadata: {
                    running_delivery_id: running.id,
                    company_id: body.company_id || null,
                    user_id: body.user_id || null
                }
            }
            return Pagarme.cardCredit(object).then(Help.returnPagarme)
        },

        listOneRunning: id => RunningDelivery.findOne({ where: { id: id }, raw: true }),

        transactionCardCielo: body => object => new Promise((resolve, reject) => {
            TransactionCardCielo.create(object)
                .then(transactionCard => {
                    const query = {
                        where: {
                            id: { $in: body.auxiliary }
                        }
                    }
                    console.log(transactionCard)
                    const mod = {
                        transaction_card_cielo_id: transactionCard.dataValues.id
                    }
                    RequestDelivery.update(mod, query)
                        .then(request => {
                            verifyUpdate(request, resolve, reject, object)
                        })
                        .catch(reject)
                })
                .catch(reject)
        }),
        transactionCard: body => object => new Promise((resolve, reject) => {
            TransactionCard.create(object.pagarmeReturn)
                .then(transactionCard => {
                    const query = {
                        where: {
                            id: { $in: body.auxiliary }
                        }
                    }
                    const mod = {
                        transaction_card_id: transactionCard.dataValues.id
                    }
                    RequestDelivery.update(mod, query)
                        .then(request => {
                            verifyUpdate(request, resolve, reject, object)
                        })
                        .catch(reject)
                })
                .catch(reject)
        }),

        tratmentMultiPoint: body => object => new Promise((resolve, reject) => {
            let createObject = []
            body.request.map((element, index) => {
                try {
                    element = element.dataValues
                    element.Rate = element.Rate.dataValues
                    createObject.push({
                        fixedValue: element.Rate.fixedValue,
                        metersSurplus: element.Rate.metersSurplus,
                        baseValue: element.Rate.baseValue1,
                        franchiseMeters: element.Rate.franchiseMeters,
                        requestReturn: element.requestReturn,
                        estimateAwait: element.estimateAwait,
                        estimateAwaitValue: element.Rate.estimateAwaitValue,
                        requestReturnValue: element.Rate.requestReturnValue,
                        time: element.time,
                        company_id: element.company_id,
                        status: true,
                        rate_id: element.Rate.id
                    })
                } catch (error) {
                    //console.log(error)
                    // throw new Error('tratment multi point dataValues')
                }
            })
            object.calculate = createObject
            resolve(object)
        }),
        refundSearch: (id, type) => {
            const query = {
                where: {
                    $and: [{
                        id: id
                    },
                    {
                        status: true
                    }
                    ],
                    $or: [{
                        typePayment: {
                            $eq: type
                        }
                    },
                    {
                        running_delivery_id: null
                    }
                    ]
                },
                raw: true
            }
            return new Promise((resolve, reject) => {
                RequestDelivery.findOne(query)
                    .then(response => verifyObject(response, resolve, reject))
                    .catch(reject)
            })
        },

        calculateVoucher: object => {
            return new Promise((resolve, reject) => {
                Company.increment(['balance'], {
                    by: parseFloat(object.valueTotal),
                    where: {
                        id: object.company_id
                    }
                })
                    .then(response => verifyUpdate(response, resolve, reject))
                    .catch(reject)
            })
        },
        alterStatusRequestDelivery: object => {
            return new Promise((resolve, reject) => {
                const query = {
                    where: {
                        id: object.id
                    }
                }
                const mod = {
                    status: false
                }
                RequestDelivery.update(mod, query)
                    .then(response => verifyUpdate(response, resolve, reject))
                    .catch(reject)
            })
        },
        transaction: (object) => {
            return new Promise((resolve, reject) => {
                TransactionCard.findById(object.transaction_card_id, { raw: true })
                    .then(object => verifyObject(object, resolve, reject))
                    .catch(reject)
            })
        },
        pagarmeRefund: (object) => {
            const objectTransaction = { id: object.pagarmeId }
            return Pagarme.reversalTransaction(objectTransaction).then(Help.returnPagarme)
        },
        refundRunning: (id, type) => {
            return new Promise((resolve, reject) => {
                const query = {
                    where: {
                        $and: [
                            { id: id },
                            { status: 2 }
                        ]
                    },
                    include: [
                        { model: RequestDelivery, where: { $and: [{ typePayment: { $eq: type } }, { running_delivery_id: id }] } }
                    ]
                }
                RunningDelivery.findOne(query)
                    .then(object => verifyObject(object, resolve, reject))
                    .catch(reject)
            })
        }
    }
}
