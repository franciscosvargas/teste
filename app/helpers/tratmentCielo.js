
/**
 * @param  {Object Response} cieloResponse
 * @callback returnObject
 */

module.exports.returnTransactionCard = (cieloResponse) => {
    try {
        return Promise.resolve({
            serviceTaxAmount: cieloResponse.Payment.ServiceTaxAmount,
            installments: cieloResponse.Payment.Installments,
            interest: cieloResponse.Payment.Installments,
            capture: cieloResponse.Payment.Capture,
            tid: cieloResponse.Payment.Tid,
            authorizationCode: cieloResponse.Payment.ReturnCode,
            softDescriptor: cieloResponse.Payment.SoftDescriptor,
            amount: cieloResponse.Payment.Amount,
            status: cieloResponse.Payment.Status,
            paymentId: cieloResponse.Payment.PaymentId,
            type: cieloResponse.Payment.Type,
            returnCode: cieloResponse.Payment.ReturnCode
        })
    } catch (err) {
        return Promise.reject(err)
    }
}
