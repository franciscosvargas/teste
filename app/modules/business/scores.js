module.exports = app => {
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    return {
        runningUpdate: (object) => new Promise((resolve, reject) => {
            console.log(object)
            if (object.running_taxi_driver_id) {
                const query = {
                    where: {
                        id: parseInt(object.running_taxi_driver_id)
                    }
                }
                const mod = {
                    status: 10
                }
                RunningTaxiDriver.update(mod, query)
                    .then(() => resolve(object))
                    .catch(reject)
            } else {
                const query = {
                    where: {
                        id: parseInt(object.running_delivery_id)
                    }
                }
                const mod = {
                    status: 10
                }
                RunningDelivery.update(mod, query)
                    .then(() => resolve(object))
                    .catch(reject)
            }
        })
    }
}
