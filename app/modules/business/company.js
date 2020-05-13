module.exports = app => {
    const User = app.datasource.models.User
    return {
        tratmentQuery: (object) => new Promise((resolve, reject) => {
            try {
                resolve({
                    pointFinish: [object.destinationLat, object.destinationLng],
                    pointInit: [parseFloat(object.clientLat), parseFloat(object.clientLng)],
                    fixedValue: object.rates.fixedValue,
                    metersSurplus: object.rates.metersSurplus,
                    baseValue: object.rates.baseValue1,
                    franchiseMeters: object.rates.franchiseMeters,
                    requestReturn: object.requestReturn,
                    estimateAwait: object.estimateAwait,
                    estimateAwaitValue: object.rates.estimateAwaitValue,
                    requestReturnValue: object.rates.requestReturnValue,
                    rate_id: object.rates.id,
                    time: object.time,
                    company_id: object.company_id || null,
                    user_id: object.user_id || null,
                    totalOrder: object.totalOrder,
                    valueReceive: object.valueReceive,
                    details: object.details,
                    change: object.change,
                    service_id: object.service_id,
                    typePayment: object.typePayment
                })
            } catch (err) {
                reject(err)
            }
        }),
        stageCompany: body => new Promise((resolve, reject) => {
            User.update({stage: 3}, {
                where: {
                    id: body.user_id
                }
            }).then(user => {
                resolve(body)
            }, error => {
                reject(error)
            })
        })
    }
}
