const url = require('../config/key').pagarme

const Regex = require('./regex')

const bank = object => {
    if (object.body.agencyDv) {
        return {
            legal_name: object.body.name.substring(0, 30),
            bank_code: object.typeBank.dataValues.code,
            agencia: object.body.agency,
            // agencia_dv: object.body.agencyDv,
            conta: object.body.account,
            conta_dv: object.body.accountDv,
            document_number: object.body.cpf
        }
    } else {
        return {
            legal_name: object.body.name,
            bank_code: object.typeBank.dataValues.code,
            agencia: object.body.agency,
            agencia_dv: object.body.agencyDv,
            conta: object.body.account,
            conta_dv: object.body.accountDv,
            document_number: object.body.cpf
        }
    }
}

const returnPagarme = object => new Promise((resolve, reject) => {
    object.response ? reject(object.response.errors) : resolve(object)
})

const returnPagarmeCustomer = object => {
    return new Promise((resolve, reject) =>
        object.response ? reject(object.response.errors) : resolve(object)
    )
}

const card = object => {
    return {
        card_number: object.body.cardNumber,
        card_expiration_date: object.body.cardExpirationDate,
        card_cvv: object.body.cardCvv,
        card_holder_name: object.body.cardHolderName
    }
}

const ticket = object => {
    const pagarme = {
        amount: Regex.clean(object.object.amount.toString()),
        metadata: {
            company_id: object.object.company_id
        },
        customer: {
            document_number: object.company.dataValues.User.dataValues.cpf || object.company.dataValues.cnpj,
            email: object.company.dataValues.User.dataValues.email,
            name: object.company.dataValues.User.dataValues.name,
            address: {
                street: object.company.dataValues.address,
                street_number: object.company.dataValues.number,
                neighborhood: object.company.dataValues.district,
                zipcode: object.company.dataValues.zipCode
            },
            phone: {
                ddd: object.company.dataValues.User.dataValues.ddd.toString(),
                number: object.company.dataValues.User.dataValues.number.toString()
            }
        },
        payment_method: 'boleto',
        postback_url: url.tiketPostbackUrl
    }
    console.log(pagarme)
    return pagarme
}

const returnTicket = (object, ticket) => {
    return {
        company_id: ticket.company_id,
        type_transaction_id: ticket.type_transaction_id,
        object: object.object,
        status: object.status,
        refuseReason: object.refuse_reason,
        statusReason: object.status_reason,
        acquirerResponseCode: object.acquirer_response_code,
        acquirerId: object.acquirer_id,
        authorizationCode: object.authorization_code,
        softDescriptor: object.soft_descriptor,
        tid: object.tid,
        nsu: object.nsu,
        amount: object.amount,
        authorizedAmount: object.authorized_amount,
        paidAmount: object.paid_amount,
        refundedAmount: object.refunded_amount,
        installments: object.installments,
        pagarmeId: object.id,
        cost: object.cost,
        cardHolderName: object.card_holder_name,
        cardLastDigits: object.card_last_digits,
        cardFirstDigits: object.card_first_digits,
        cardBrand: object.card_brand,
        cardPinMode: object.card_pin_mode,
        postbackUrl: object.postback_url,
        paymentMethod: object.payment_method,
        captureMethod: object.capture_method,
        antifraudScore: object.antifraud_score,
        boletoUrl: object.boleto_url,
        boletoBarcode: object.boleto_barcode,
        boletoExpirationDate: object.boleto_expiration_date
    }
}

const postBackTicket = (object) => {
    return {
        fingerprint: object.fingerprint,
        pagarmeId: object.id,
        currentStatus: object.current_status,
        company_id: object.transaction.metadata.company_id,
        authorizedAmount: object.transaction.authorized_amount,
        amount: object.transaction.amount,
        cost: object.transaction.cost,
        cardLastDigits: object.transaction.card.last_digits,
        cardFirstDigits: object.transaction.card.card_first_digits,
        cardBrand: object.transaction.card_brand,
        cardPinMode: object.transaction.card_pin_mode
    }
    // return {
    //     pagarmeId: object.id,
    //     fingerprint: object.fingerprint,
    //     currentStatus: object.current_status,
    //     company_id: object['transaction[metadata][company_id]'],
    //     authorizedAmount: object['transaction[authorized_amount]'],
    //     amount: object['transaction[amount]'],
    //     cost: object['transaction[cost]'],
    //     cardHoldName: object['transaction[card_holder_name]'],
    //     cardLastDigits: object['transaction[card_last_digits]'],
    //     cardBrand: object['transaction[card_brand]'],
    //     cardPinMode: object['transaction[card_pin_mode]']
    // }
}

const postBackCardCredit = (object) => {
    return {
        event: object.event,
        fingerprint: object.fingerprint,
        pagarmeId: object.id,
        status: object.current_status,
        amount: object.transaction.amount,
        company_id: object.transaction.metadata.company_id,
        user_id: object.transaction.metadata.user_id,
        authorizedAmount: object.transaction.authorized_amount,
        cost: object.transaction.cost,
        cardId: object.transaction.card.id,
        cardLastDigits: object.transaction.card.last_digits,
        cardFirstDigits: object.transaction.card.card_first_digits,
        cardBrand: object.transaction.card_brand,
        cardPinMode: object.transaction.card_pin_mode
    }
    // return {
    //     event: object.event,
    //     fingerprint: object.fingerprint,
    //     pagarmeId: object.id,
    //     status: object.current_status,
    //     amount: object['transaction[amount]'],
    //     company_id: object['transaction[metadata][company_id]'],
    //     user_id: object['transaction[metadata][user_id]'],
    //     authorizedAmount: object['transaction[authorized_amount]'],
    //     cost: object['transaction[cost]'],
    //     cardId: object['transaction[card][id]'],
    //     cardHoldName: object['transaction[card_holder_name]'],
    //     cardLastDigits: object['transaction[card_last_digits]'],
    //     cardBrand: object['transaction[card_brand]'],
    //     cardPinMode: object['transaction[card_pin_mode]']
    // }
}

const postBackCardCreditTransaction = (object) => {
    return {
        event: object.event,
        fingerprint: object.fingerprint,
        pagarmeId: object.id,
        status: object.current_status,
        amount: object.transaction.amount,
        running_delivery_id: object.transaction.metadata.running_delivery_id,
        running_taxi: object.transaction.metadata.running_taxi,
        company_id: object.transaction.metadata.company_id,
        user_id: object.transaction.metadata.user_id,
        authorizedAmount: object.transaction.authorized_amount,
        cost: object.transaction.cost,
        cardId: object.transaction.card.id,
        cardHoldName: object.transaction.card_holder_name,
        cardLastDigits: object.transaction.card.last_digits,
        cardFirstDigits: object.transaction.card.card_first_digits,
        cardBrand: object.transaction.card_brand,
        cardPinMode: object.transaction.card_pin_mode
    }
    // return {
    //     event: object.event,
    //     fingerprint: object.fingerprint,
    //     pagarmeId: object.id,
    //     status: object.current_status,
    //     amount: object['transaction[amount]'],
    //     running_delivery_id: object['transaction[metadata][running_delivery_id]'],
    //     company_id: object['transaction[metadata][company_id]'],
    //     user_id: object['transaction[metadata][user_id]'],
    //     authorizedAmount: object['transaction[authorized_amount]'],
    //     cost: object['transaction[cost]'],
    //     cardId: object['transaction[card][id]'],
    //     cardHoldName: object['transaction[card_holder_name]'],
    //     cardLastDigits: object['transaction[card_last_digits]'],
    //     cardBrand: object['transaction[card_brand]'],
    //     cardPinMode: object['transaction[card_pin_mode]']
    // }
}

const cardCredit = (object) => ({
    amount: Regex.clean(object.amount.toString()),
    card_id: object.card.cardId,
    cvv: object.card.cardCvv,
    payment_method: 'credit_card',
    postback_url: url.cardPostBackUrl,
    customer: object.customer,
    metadata: {
        company_id: object.company_id
    }
})

const returnCardCredit = object => Object.assign({
    pagarmeReturn: {
        company_id: object.card.company_id || null,
        user_id: object.card.user_id || null,
        type_transaction_id: object.card.type_transaction_id || 2,
        object: object.pagarme.object,
        status: object.pagarme.status,
        refuseReason: object.pagarme.refuse_reason,
        statusReason: object.pagarme.status_reason,
        acquirerResponseCode: object.pagarme.acquirer_response_code,
        acquirerName: object.pagarme.acquirer_name,
        authorizationCode: object.pagarme.authorization_code,
        softDescriptor: object.pagarme.soft_descriptor,
        tid: object.pagarme.tid,
        nsu: object.pagarme.nsu,
        amountNotTax: object.card.amountNotTax || object.pagarme.amount,
        amount: object.pagarme.amount,
        authorizedAmount: object.pagarme.authorized_amount,
        paidAmount: object.pagarme.paid_amount,
        refundedAmount: object.pagarme.refunded_amount,
        installments: object.pagarme.installments,
        pagarmeId: object.pagarme.id,
        cost: object.pagarme.cost,
        cardHolderName: object.pagarme.card_holder_name,
        cardLastDigits: object.pagarme.card_last_digits,
        cardFirstDigits: object.pagarme.card_first_digits,
        cardBrand: object.pagarme.card_brand,
        cardPinMode: object.pagarme.card_pin_mode,
        card_id: object.card.id,
        postbackUrl: object.pagarme.postback_url,
        paymentMethod: object.pagarme.payment_method,
        captureMethod: object.pagarme.capture_method,
        antifraudScore: object.pagarme.antifraud_score
    }
}, object)

const returnCardCreditCapture = object => {
    return {
        user_id: object.user.dataValues.id,
        type_transaction_id: 2,
        object: object.pagarme.object,
        status: object.transaction['status'],
        refuseReason: object.pagarme.refuse_reason,
        statusReason: object.pagarme.status_reason,
        acquirerResponseCode: object.pagarme.acquirer_response_code,
        acquirerName: object.pagarme.acquirer_name,
        authorizationCode: object.pagarme.authorization_code,
        softDescriptor: object.pagarme.soft_descriptor,
        tid: object.pagarme.tid,
        nsu: object.pagarme.nsu,
        amount: object.pagarme.amount,
        amountNotTax: object.calculate.requestTaxi.valueTotal,
        authorizedAmount: object.pagarme.authorized_amount,
        paidAmount: object.pagarme.paid_amount,
        refundedAmount: object.pagarme.refunded_amount,
        installments: object.pagarme.installments,
        pagarmeId: object.pagarme.id,
        cost: object.pagarme.cost,
        cardHolderName: object.pagarme.card_holder_name,
        cardLastDigits: object.pagarme.card_last_digits,
        cardFirstDigits: object.pagarme.card_first_digits,
        cardBrand: object.pagarme.card_brand,
        cardPinMode: object.pagarme.card_pin_mode,
        postbackUrl: object.pagarme.postback_url,
        paymentMethod: object.pagarme.payment_method,
        captureMethod: object.pagarme.capture_method,
        antifraudScore: object.pagarme.antifraud_score,
        card_id: object.card.id,
        request_taxi_driver_id: object.pagarme.metadata.request_taxi_driver_id
    }
}

const returnCardCreditTaxi = object => ({
    user_id: object.card.dataValues.User.dataValues.id,
    type_transaction_id: 2,
    object: object.transaction.object,
    status: object.transaction.status,
    refuseReason: object.transaction.refuse_reason,
    statusReason: object.transaction.status_reason,
    acquirerResponseCode: object.transaction.acquirer_response_code,
    acquirerName: object.transaction.acquirer_name,
    authorizationCode: object.transaction.authorization_code,
    softDescriptor: object.transaction.soft_descriptor,
    tid: object.transaction.tid,
    nsu: object.transaction.nsu,
    amount: object.newValue ? object.newValue : object.valueOld,
    amountNotTax: object.valueOld,
    authorizedAmount: object.transaction.authorized_amount,
    paidAmount: object.transaction.paid_amount,
    refundedAmount: object.transaction.refunded_amount,
    installments: object.transaction.installments,
    pagarmeId: object.transaction.id,
    cost: object.transaction.cost,
    cardHolderName: object.transaction.card_holder_name,
    cardLastDigits: object.transaction.card_last_digits,
    cardFirstDigits: object.transaction.card_first_digits,
    cardBrand: object.transaction.card_brand,
    cardPinMode: object.transaction.card_pin_mode,
    postbackUrl: object.transaction.postback_url,
    paymentMethod: object.transaction.payment_method,
    captureMethod: object.transaction.capture_method,
    antifraudScore: object.transaction.antifraud_score,
    card_id: object.card.dataValues.id
})

const returnCardCompany = (objectCard, card) => {
    return {
        object: objectCard.object,
        cardId: objectCard.id,
        dateCreated: objectCard.date_created,
        dateUpdated: objectCard.date_updated,
        brand: objectCard.brand,
        holderName: objectCard.holder_name,
        firstDigits: objectCard.first_digits,
        lastDigits: objectCard.last_digits,
        country: objectCard.country,
        fingerprint: objectCard.fingerprint,
        valid: objectCard.valid,
        expiration_date: objectCard.expiration_date,
        cardCvv: card.cardCvv,
        company_id: card.company_id,
        status: true
    }
}

const returnCardUser = (objectCard, card) => {
    return {
        object: objectCard.object,
        cardId: objectCard.id,
        dateCreated: objectCard.date_created,
        dateUpdated: objectCard.date_updated,
        brand: objectCard.brand,
        holderName: objectCard.holder_name,
        firstDigits: objectCard.first_digits,
        lastDigits: objectCard.last_digits,
        country: objectCard.country,
        fingerprint: objectCard.fingerprint,
        valid: objectCard.valid,
        expiration_date: objectCard.expiration_date,
        cardCvv: card.cardCvv,
        user_id: card.user_id,
        status: true
    }
}

module.exports = {
    bank: bank,
    card: card,
    returnCardCreditTaxi: returnCardCreditTaxi,
    postBackCardCreditTransaction: postBackCardCreditTransaction,
    returnCardCompany: returnCardCompany,
    cardCredit: cardCredit,
    ticket: ticket,
    returnTicket: returnTicket,
    returnCardUser: returnCardUser,
    postBackCardCredit: postBackCardCredit,
    returnCardCredit: returnCardCredit,
    returnPagarme: returnPagarme,
    returnCardCreditCapture: returnCardCreditCapture,
    postBackTicket: postBackTicket,
    returnPagarmeCustomer: returnPagarmeCustomer
}