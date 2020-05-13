module.exports = app => {
    const Driver = app.datasource.models.Driver
    const User = app.datasource.models.User
    const Company = app.datasource.models.Company
    const LastLocation = app.datasource.models.LastLocation
    const RunningDelivery = app.datasource.models.RunningDelivery
    const LogProblemRunningCompany = app.datasource.models.LogProblemRunningCompany

    return {
        updateService: object => update => new Promise((resolve, reject) => {
            const query = {
                where: { user_id: object.user_id }
            }
            const mod = {
                service_id: object.service_id
            }
            Driver.update(mod, query)
                .then(resolve)
                .catch(reject)
        }),
        isDriver: object => new Promise(async (resolve, reject) => {
            try {
                const driver = await Driver.findOne({ where: { user_id: object.user_id }, raw: true })
                if (driver) {
                    resolve(driver)
                } else {
                    const mod = { user_id: object.user_id, status: true }
                    const driver = await Driver.create(mod)
                    resolve(driver)
                }
            } catch (err) {
                reject(err)
            }
        }),
        stageUser: body => new Promise((resolve, reject) => {
            User.update({ stage: 4 }, {
                where: {
                    id: body.user_id
                }
            })
                .then(resolve)
                .catch(reject)
        }),
        RunningDeliveryListOneOpen: id =>
            RunningDelivery.findOne({
                where: {
                    $and: [
                        { driver_id: id },
                        { status: [4, 5] }
                    ]
                },
                include: {
                    all: true
                }
            }),

        balanceReturn: object => new Promise((resolve, reject) => {
            if (object) {
                if (object.dataValues.company_id != null && object.dataValues.RequestDeliveries[0].dataValues.typePayment === 3) {
                    Company.increment(['balance'], {
                        by: parseFloat(object.value),
                        where: {
                            id: object.company_id
                        }
                    })
                        .then(() => resolve(object))
                        .catch(reject)
                } else {
                    resolve(object)
                }
            } else {
                reject({
                    title: 'Error',
                    message: 'Error, corrida inexistente!'
                })
            }
        }),
        RunningDeliveryUpdate: object => new Promise((resolve, reject) =>
            RunningDelivery.update({
                freeDriver: false,
                status: 9
            }, {
                    where: {
                        driver_id: object.dataValues.driver_id,
                        id: object.dataValues.id
                    }
                })
                .then(() => resolve(object))
                .catch(reject)),

        logProblemRunning: (user, description) => object => new Promise((resolve, reject) => {
            LogProblemRunningCompany.create({
                driver_id: object.dataValues.driver_id,
                value: object.dataValues.value,
                running_delivery_id: object.dataValues.id,
                user_id: user.id,
                description: description
            })
                .then(() => resolve(object))
                .catch(reject)
        }),
        lastLocationUpdate: object => LastLocation.update({ driver_id: parseInt(object.dataValues.driver_id) }, { $set: { ocuped: false, status: true, accept: false, active: true, block: false } })
    }
}
