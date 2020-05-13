module.exports = app => {
    const Rates = app.datasource.models.Rates
    const City = app.datasource.models.City
    const State = app.datasource.models.State
    const Country = app.datasource.models.Country
    const Card = app.datasource.models.Card
    const User = app.datasource.models.User
    const Address = app.datasource.models.Address
    const RequestTaxiDriver = app.datasource.models.RequestTaxiDriver
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const RequestDelivery = app.datasource.models.RequestDelivery
    const RunningDelivery = app.datasource.models.RunningDelivery
    const TransactionCard = app.datasource.models.TransactionCard
    const PromoCodeUser = app.datasource.models.PromoCodeUser
    const TransactionCardCielo = app.datasource.models.TransactionCardCielo
    const PromoCode = app.datasource.models.PromoCode
    const moment = require('moment')
    const Rules = require('../../helpers/rulesCalculate')(app)
    const Regex = require('../../helpers/regex')

    const Pagarme = require('../../helpers/pagarme')
    const TratmentPagarme = require('../../helpers/tratmentPagarme')

    const Cielo = require('../../helpers/cielo')

    const url = require('../../config/key').pagarme
    const tratment = (reject) => reject({
        title: 'Error',
        message: 'Tarifa não existe!'
    })

    return {
        validateRates: (object) => {
            return new Promise((resolve, reject) => {
                console.log(object);
                Rates.findOne({
                    where: {
                        service_id: parseInt(object.service_id)
                    }
                    /*include: [
                        {
                            model: City,
                            where: {
                                name: {
                                    $like: object.addressClient.city
                                }
                            }
                        },
                        {
                            model: State,
                            where: {
                                initials: object.addressClient.state
                            }
                        },
                        {
                            model: Country,
                            where: {
                                initials: object.addressClient.country
                            }
                        }
                    ]*/
                }).then(rates => {
                    if (rates) {
                        object.rates = rates.dataValues
                        resolve(object)
                    } else {
                        reject({
                            title: 'Error',
                            message: 'Não temos serviço do IUVO Club na sua localidade!'
                        })
                    }
                }).catch(reject)
            })
        },
        listOnePromoCode: req => object => new Promise((resolve, reject) => {
            let initDate = moment().utcOffset(0).set({ hour: 0, minute: 0, second: 0, millisecond: 1 })
            PromoCodeUser.findOne({
                where: {
                    user_id: req.user.object.id
                },
                include: [
                    {
                        model: PromoCode,
                        where: {
                            $and: [
                                { expirateDate: { $gt: initDate } },
                                { status: true },
                                { amount: { $gt: 0 } },
                                { service_id: req.body.service_id }
                            ]
                        },
                        required: true
                    }
                ]
            })
                .then(resp => resolve(Object.assign({ calculate: object, promocode: resp }, {})))
                .catch(reject)
        }),

        isValidateCupomTaxi: req => object => new Promise((resolve, reject) => {
            if (object.promocode) {
                RequestTaxiDriver.count({
                    where: {
                        $and: [
                            {
                                promo_code_id: object.promocode.dataValues.promo_code_id
                            }
                        ]
                    },
                    include: [
                        {
                            model: RunningTaxiDriver,
                            where: {
                                $and: [
                                    {
                                        status: { $in: [6, 10] }
                                    },
                                    {
                                        user_id: req.body.user_id
                                    }
                                ]
                            }
                        }
                    ]
                })
                    .then(resp => {
                        if (!(object.promocode.dataValues.PromoCode.amountPerUser > parseInt(resp) && object.promocode.dataValues.PromoCode.amount > parseInt(resp))) {
                            resolve(Object.assign({ calculate: object.calculate }, {}))
                        } else {
                            resolve(object)
                        }
                    })
                    .catch(reject)
            } else {
                resolve(object)
            }
        }),
        isValidateCupomDelivery: req => object => new Promise(async (resolve, reject) => {
            if (object.promocode) {
                const resp = await RequestDelivery.count({
                    where: {
                        $and: [
                            {
                                promo_code_id: object.promocode.dataValues.promo_code_id
                            },
                            {
                                user_id: req.body.user_id
                            }
                        ]
                    },
                    include: [
                        {
                            model: RunningDelivery,
                            required: true,
                            where: { status: { $in: [6, 10] } }
                        }
                    ]
                })
                console.log('resposta', resp)
                console.log('object.promocode.dataValues.PromoCode.amountPerUser', object.promocode.dataValues.PromoCode.amountPerUser)
                console.log('object.promocode.dataValues.PromoCode.amount', object.promocode.dataValues.PromoCode.amount)
                if (object.promocode.dataValues.PromoCode.amountPerUser > parseInt(resp)
                    && object.promocode.dataValues.PromoCode.amount > parseInt(resp)) {
                    return resolve(object)
                } else {
                    return resolve(Object.assign({ calculate: object.calculate }, {}))
                }
            } else {
                resolve(object)
            }
        }),
        isValidateUse: req => object => new Promise((resolve, reject) => {
            if (object.promocode) {
                if (object.promocode.dataValues.PromoCode.service_id === req.body.service_id) {
                    if (object.promocode.dataValues.PromoCode.billingType === 1) {
                        object.calculate.valueNew = ((object.calculate.valueTotal - parseFloat(object.promocode.dataValues.PromoCode.value)).toFixed(2) < 0)
                            ? 0.0 : (object.calculate.valueTotal - parseFloat(object.promocode.dataValues.PromoCode.value)).toFixed(2)
                        resolve(object)
                    } else if (object.promocode.dataValues.PromoCode.billingType === 2) {
                        object.calculate.valueNew = ((object.calculate.valueTotal - (object.calculate.valueTotal * parseFloat(object.promocode.dataValues.PromoCode.value)).toFixed(2)).toFixed(2) < 0)
                            ? 0.0 : ((object.calculate.valueTotal - (object.calculate.valueTotal * parseFloat(object.promocode.dataValues.PromoCode.value))).toFixed(2))
                        resolve(object)
                    }
                } else {
                    object.valueNew = object.calculate.valueTotal
                    resolve(object)
                }
            } else {
                object.valueNew = object.calculate.valueTotal
                resolve(object)
            }
        }),
        queryCreateRequest: (object, body) => ({
            originAddresses: body.originName ? body.originName : object.originAddresses[0],
            destinationAddresses: object.destinationAddresses[0],
            minBandeirada1: object.rates.minBandeirada1,
            minBandeirada2: object.rates.minBandeirada2,
            rate_id: object.rates.id,
            meters: object.meters,
            valueTotal: object.valueTotal,
            kilometers: object.kilometers,
            pointInit: { type: 'Point', coordinates: [object.clientLat, object.clientLng] },
            pointFinish: { type: 'Point', coordinates: [object.destinationLat, object.destinationLng] },
            totalOrder: object.totalOrder,
            duration: object.duration,
            durationTime: object.durationTime,
            typePayment: object.typePayment,
            valuOldPromocode: object.valueOldRequest,
            map: object.map || null
        }),
        requestTaxi: body => object => new Promise((resolve, reject) => {
            object.valueRequest = object.valueTotal
            if (parseFloat(body.cardDiscount) > 0) {
                object.valueTotal = object.valueTotal - (object.valueTotal * (parseFloat(body.cardDiscount) / 100)) < 0 ? 0.0 : object.valueTotal - (object.valueTotal * (parseFloat(body.cardDiscount) / 100))
            } else if (parseFloat(body.moneyDiscount) > 0) {
                object.valueTotal = object.valueTotal - (object.valueTotal * (parseFloat(body.moneyDiscount) / 100)) < 0 ? 0.0 : object.valueTotal - (object.valueTotal * (parseFloat(body.moneyDiscount) / 100))
            }
            object.valueOldRequest = object.valueTotal
            if (body.promo_code_id) {
                if (body.promocode.billingType === 1) {
                    object.valueTotal = (object.valueTotal - parseFloat(body.promocode.value)).toFixed(2) < 0 ? 0.0 : (object.valueTotal - parseFloat(body.promocode.value)).toFixed(2)
                } else {
                    object.valueTotal = (parseFloat(object.valueTotal) - (parseFloat(object.valueTotal) * parseFloat(body.promocode.value))).toFixed(2) < 0 ? 0.0 : (parseFloat(object.valueTotal) - (parseFloat(object.valueTotal) * parseFloat(body.promocode.value))).toFixed(2)
                }
            }
            try {
                resolve(object)
            } catch (err) {
                reject({ title: 'Error', message: 'Tratment Return object calculate' })
            }
        }),

        createRequest1: body => object => {
            let query = object
            query.originAddresses = body.originName ? body.originName : object.originAddresses[0]
            query.destinationAddresses = body.destinyName ? body.destinyName : object.destinationAddresses[0]
            // query.destinationAddresses = object.destinationAddresses[0]
            query.minBandeirada1 = query.rates.minBandeirada1
            query.minBandeirada2 = query.rates.minBandeirada2
            query.rate_id = query.rates.id
            query.pointInit = { type: 'Point', coordinates: [query.clientLat, query.clientLng] }
            query.pointFinish = { type: 'Point', coordinates: [query.destinationLat, query.destinationLng] }
            query.valuOldPromocode = object.valueRequest || 0.0
            return RequestTaxiDriver.create(query)
        },
        createRequestCard: object => new Promise((resolve, reject) => {
            RequestTaxiDriver.create(object)
                .then(request => resolve(Object.assign({
                    requestTaxi: request.dataValues
                }, object)))
                .catch(reject)
        }),

        crateRunningTaxi: body => object => new Promise((resolve, reject) => {
            const running = {
                request_taxi_driver_id: object.calculate.requestTaxi.id,
                user_id: object.user.id,
                value: (body.promo_code_id)
                    ? body.promocode.typePayment === 2 && body.promocode
                        ? (object.calculate.valueTotal - parseFloat(body.promocode.value)).toFixed(2) < 0 ? 0.0 : (object.calculate.valueTotal - parseFloat(body.promocode.value)).toFixed(2)
                        : (parseFloat(object.calculate.valueTotal) - (parseFloat(object.calculate.valueTotal) * parseFloat(body.promocode.value))).toFixed(2) > 0 ? 0.0 : (parseFloat(object.calculate.valueTotal) - (parseFloat(object.calculate.valueTotal) * parseFloat(body.promocode.value))).toFixed(2)
                    : object.calculate.valueTotal = parseFloat(object.cardDiscount) > 0.0 ? object.calculate.valueTotal - (object.calculate.valueTotal * (parseFloat(body.cardDiscount) / 100)) < 0 ? 0.0 : object.calculate.valueTotal - (object.calculate.valueTotal * (parseFloat(body.cardDiscount) / 100)) : object.calculate.valueTotal,
                service_id: body.service_id,
                cardDiscount: body.cardDiscount,
                moneyDiscount: body.moneyDiscount,
                typePayment: body.typePayment,
                cardMarchine: true,
                status: 1
            }
            running.percentCard = running.value * 0.10
            RunningTaxiDriver.create(running)
                .then(running => resolve(Object.assign({
                    running: running.dataValues
                }, object)))
                .catch(reject)
        }),
        calculateTaximeter: object => Rules.bandeirada(object),

        cardListOne: body => calculate => new Promise((resolve, reject) => {
            const query = {
                where: {
                    $and: [
                        {
                            user_id: body.user_id
                        },
                        {
                            cardId: body.card_id
                        }
                    ]
                },
                raw: true
            }
            Card.findOne(query)
                .then(card =>
                    card
                        ? resolve({ card: card, calculate: calculate })
                        : reject({ title: 'Cartão', message: 'Cartão é requerido!' }))
                .catch(reject)
        }),

        listOneUser: object => new Promise((resolve, reject) => {
            const query = {
                where: {
                    $and: [
                        {
                            id: object.card.user_id
                        },
                        {
                            status: true
                        }
                    ]
                },
                include: [{
                    model: Address
                }]
            }
            User.findOne(query)
                .then(user =>
                    user ? resolve(Object.assign({
                        user: user
                    }, {
                            address: user.dataValues.Addresses[0]
                        }, object))
                        : reject({ title: 'Usário', message: 'Usuário é requerido!' }))
                .catch(reject)
        }),
        transactionCardCielo: object =>
            Cielo.transactionCard({
                MerchantOrderId: object.running.id,
                Customer: {
                    Name: object.user.name
                },
                Payment: {
                    Type: 'CreditCard',
                    capture: true,
                    Amount: Regex.clean(((object.calculate.valueTotal * 1.10).toFixed(2)).toString()),
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
        pagarmeCapture: object => new Promise((resolve, reject) => {
            try {
                resolve(Object.assign({
                    transactionCard: {
                        capture: false,
                        amount: Regex.clean(((object.calculate.valueTotal * 1.10).toFixed(2)).toString()),
                        card_id: object.card.cardId,
                        card_cvv: object.card.cardCvv,
                        payment_method: 'credit_card',
                        customer: {
                            name: object.user.name,
                            email: object.user.email,
                            document_number: Regex.clean(object.user.dataValues.cpf),
                            address: {
                                street: object.address.address,
                                street_number: object.address.number,
                                neighborhood: object.address.district,
                                zipcode: object.address.zipCode
                            },
                            phone: {
                                ddi: `${object.user.dataValues.ddi}`,
                                ddd: object.user.dataValues.ddd.toString(),
                                number: object.user.dataValues.number.toString()
                            }
                        },
                        metadata: {
                            running_taxi: object.running.id,
                            request_taxi_driver_id: object.calculate.requestTaxi.id,
                            user_id: object.user.id
                        }
                    }
                }, object))
            } catch (err) {
                console.log(err)
                reject({ title: 'Error', message: 'Tratment capture card' })
            }
        }),

        searchPagarme: object => new Promise((resolve, reject) => {
            if (parseFloat(object.running.value) > 0) {
                Pagarme.getTransaction(object.pagarme.id)
                    .then(pagarmeSearch => resolve(Object.assign({ transaction: pagarmeSearch }, object)))
                    .catch(reject)
            } else {
                resolve(object)
            }
        }),
        transactionCardTaxi: object => new Promise((resolve, reject) => {
            if (parseFloat(object.running.value) > 0) {
                Pagarme.cardCredit(object.transactionCard)
                    .then(TratmentPagarme.returnPagarme)
                    .then(pagarme => {
                        resolve(Object.assign({ pagarme: pagarme }, object))
                    })
                    .catch(reject)
            } else {
                resolve(object)
            }
        }),
        transactionTratmentCielo: (running, object) => new Promise(async (resolve, reject) => {
            try {
                if (parseFloat(running.running.value) > 0) {
                    object.user_id = running.running.user_id
                    object.card_id = running.card.id
                    const transactionCard = await TransactionCardCielo.create(object)
                    resolve(Object.assign({ transactionCreateCard: transactionCard.dataValues }, running))
                } else {
                    resolve(running)
                }
            } catch (err) {
                console.log('estou aqui', err)
                reject({ title: 'Capture', message: 'Tratment transaction card capture' })
            }
        }),
        transactionTratmentPagarme: object => new Promise(async (resolve, reject) => {
            try {
                if (parseFloat(object.running.value) > 0) {
                    const objectCreate = TratmentPagarme.returnCardCreditCapture(object)
                    const transactionCard = await TransactionCard.create(objectCreate)
                    resolve(Object.assign({ transactionCreateCard: transactionCard.dataValues }, object))
                } else {
                    resolve(object)
                }
            } catch (err) {
                console.log('estou aqui', err)
                reject({ title: 'Capture', message: 'Tratment transaction card capture' })
            }
        }),

        requestTaxiUpdateCielo: object => new Promise((resolve, reject) => {
            if (parseFloat(object.calculate.valueTotal) > 0) {
                const query = {
                    where: {
                        id: object.calculate.requestTaxi.id
                    }
                }
                const mod = {
                    transaction_card_cielo_id: object.transactionCreateCard.id,
                    running_taxi_driver_id: object.running.id
                }
                RequestTaxiDriver.update(mod, query)
                    .then(() => resolve(object))
                    .catch(reject)
            } else {
                const query = {
                    where: {
                        $and: [
                            { id: object.calculate.requestTaxi.id }
                        ]
                    }
                }
                const mod = {
                    transaction_card_cielo_id: object.transactionCreateCard.id,
                    running_taxi_driver_id: object.running.id,
                    status: 2
                }
                RequestTaxiDriver.update(mod, query)
                    .then(() => resolve(object))
                    .catch(reject)
            }
        }),
        requestTaxiUpdate: object => new Promise((resolve, reject) => {
            console.log('requestTaxiUpdate', object.calculate.requestTaxi.id)
            if (parseFloat(object.calculate.valueTotal) > 0) {
                const query = {
                    where: {
                        id: object.calculate.requestTaxi.id
                    }
                }
                const mod = {
                    transaction_card_id: object.transactionCreateCard.id,
                    running_taxi_driver_id: object.running.id,
                    status: object.transactionCreateCard.status === 'authorized' ? 2 : 8
                }
                RequestTaxiDriver.update(mod, query)
                    .then(() => resolve(object))
                    .catch(reject)
            } else {
                const query = {
                    where: {
                        $and: [
                            { id: object.calculate.requestTaxi.id }
                        ]
                    }
                }
                const mod = {
                    // transaction_card_id: object.transactionCreateCard.id,
                    running_taxi_driver_id: object.running.id,
                    status: 2
                }
                RequestTaxiDriver.update(mod, query)
                    .then(() => resolve(object))
                    .catch(reject)
            }
        }),
        runningUpdateCielo: object => new Promise((resolve, reject) => {
            if (parseFloat(object.running.value) > 0) {
                console.log('object.transactionCreateCard', object.transactionCreateCard)
                RunningTaxiDriver.update({
                    status: object.transactionCreateCard.returnCode == '000' || object.transactionCreateCard.returnCode == '00' ? 2 : 8,
                    percentCard: 0.10
                }, { where: { id: object.running.id } })
                    .then(resp => {
                        object.running.status = object.transactionCreateCard.returnCode == '000' || object.transactionCreateCard.returnCode == '00' ? 2 : 8
                        resolve(object)
                    })
                    .catch(reject)
            } else {
                RunningTaxiDriver.update({
                    status: 2,
                    percentCard: 0.10
                }, { where: { id: object.running.id } })
                    .then(resp => {
                        object.running.status = 2
                        resolve(object)
                    })
                    .catch(reject)
            }
        }),
        runningUpdate: object => new Promise((resolve, reject) => {
            if (parseFloat(object.calculate.valueTotal) > 0) {
                RunningTaxiDriver.update({
                    status: object.transactionCreateCard.status === 'authorized' ? 2 : 8,
                    percentCard: 0.10
                }, { where: { id: object.running.id } })
                    .then(resp => {
                        object.running.status = object.transactionCreateCard.status === 'authorized' ? 2 : 8
                        resolve(object)
                    })
                    .catch(reject)
            } else {
                RunningTaxiDriver.update({
                    status: 2,
                    percentCard: 0.10
                }, { where: { id: object.running.id } })
                    .then(resp => {
                        object.running.status = 2
                        resolve(object)
                    })
                    .catch(reject)
            }
        })
    }
}
