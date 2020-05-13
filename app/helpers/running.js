module.exports = app => {
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const RequestTaxiDriver = app.datasource.models.RequestTaxiDriver
    return {
        runningCreate: (body, status) => object => new Promise((resolve, reject) => {
            const running = {
                request_taxi_driver_id: object.dataValues.id,
                user_id: body.user_id,
                value: object.valueTotal,
                company_id: body.company_id,
                service_id: body.service_id,
                status: status,
                cardMarchine: false,
                typePayment: body.typePayment,
                cardDiscount: body.cardDiscount,
                moneyDiscount: body.moneyDiscount,
                driver_id: body.driverId
            }
            RunningTaxiDriver.create(running)
                .then(runningCreate => resolve({running: runningCreate, object: object}))
                .catch(reject)
        }),
        updateRequest: object => new Promise((resolve, reject) => {
            const query = {
                where: {
                    id: object.object.dataValues.id
                }
            }
            const mod = {
                running_taxi_driver_id: object.running.dataValues.id
            }
            RequestTaxiDriver.update(mod, query)
                .then(() => resolve(object))
                .catch(reject)
        }),
        tratmentObjectReturn: object => ({
            id: object.running.dataValues.id,
            pointInit: object.object.dataValues.pointInit,
            pointFinish: object.object.dataValues.pointFinish,
            service_id: object.running.dataValues.service_id,
            status: object.running.dataValues.status,
            user_id: object.running.dataValues.user_id,
            driver_id: object.running.dataValues.driver_id
        }),
        tratmentObjectReturnCard: (object, user) => ({
            id: object.running.id,
            service_id: object.running.service_id,
            status: object.running.status,
            user_id: user.id,
            pointInit: object.calculate.requestTaxi.pointInit,
            pointFinish: object.calculate.requestTaxi.pointFinish
        })
    }
}
