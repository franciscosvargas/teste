module.exports = app => {
    const Generator = require('../../helpers/generator')(app)
    // const SendEmail = require('../../helpers/sendEmail')(app)
    const moment = require('moment')
    const Users = app.datasource.models.users
    const Shop = app.datasource.models.shops
    const Driver = app.datasource.models.Driver
    const RunningDelivery = app.datasource.models.RunningDelivery
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const LastLocation = app.datasource.models.LastLocation

    const LogDriver = require('../business/logDriver')(app)

    return {
        authenticate: res => (object) => {
            try {
                const payload = {id: object.id, name: object.name, master: object.master}
                const tokenGenerator = Generator.token(payload)

                const query = {where: {id: object.id}}
                const mod = {token: tokenGenerator, online: true}

                object.online = true
                delete object.password;
                delete object.token;
                delete object.password_recover_token;

                Users.update(mod, query)
                    .then(() => res.status(200).json({token: tokenGenerator, user: object}))
                    .catch(() => res.status(400).json({error: 'Error in data processing'}))
            } catch (err) {
                console.log(err)
                res.status(400).json({error: 'Error in data processing'})
            }
        },
        authenticateShop: res => (object) => {
            try {
                const payload = {id: object.id, name: object.name, master: object.master}
                const tokenGenerator = Generator.token(payload)

                const query = {where: {id: object.id}}
                const mod = {token: tokenGenerator, online: true}

                object.online = true
                delete object.password;
                delete object.token;
                delete object.password_recover_token;

                Shop.update(mod, query)
                    .then(() => res.status(200).json({token: tokenGenerator, shop: object}))
                    .catch(() => res.status(400).json({error: 'Error in data processing'}))
            } catch (err) {
                console.log(err)
                res.status(400).json({error: 'Error in data processing'})
            }
        },
        isRunningDelivery: object => new Promise((resolve, reject) => {
            if (object.dataValues.Drivers.length > 0) {
                const query = {
                    where: {
                        $and: [
                            {driver_id: object.Drivers[0].id},
                            {status: [4, 5]}
                        ]
                    }
                }
                RunningDelivery.findOne(query)
                    .then(resp => {
                        if (resp) {
                            resolve(Object.assign({runningDelivery: true}, object))

                        } else {
                            resolve(Object.assign({runningDelivery: false}, object))
                        }
                    })
                    .catch(reject)
            } else {
                resolve(object)
            }
        }),
        isRunningTaxi: object => new Promise((resolve, reject) => {
            if (object.Drivers.length > 0) {
                const query = {
                    where: {
                        $and: [
                            {driver_id: object.Drivers[0].id},
                            {status: [4, 5]}
                        ]
                    }
                }
                RunningTaxiDriver.findOne(query)
                    .then(resp => {
                        if (resp) {
                            resolve(Object.assign({runningTaxiDriver: true}, object))
                        } else {
                            resolve(Object.assign({runningTaxiDriver: false}, object))
                        }
                    })
                    .catch(reject)
            } else {
                resolve(object)
            }
        }),
        driverOnline: object => new Promise((resolve, reject) => {
            try {
                if (object.Drivers.length > 0 && (object.runningDelivery !== true || object.runningTaxiDriver !== true)) {
                    Driver.update({status: true, updated_at: moment()}, {where: {id: object.Drivers[0].dataValues.id}})
                        .then(resp => {
                            object.dataValues.Drivers[0].dataValues.status = true
                            resolve(object)
                        })
                        .catch(reject)
                } else {
                    resolve(object)
                }
            } catch (err) {
                reject(err)
                console.log(err)
            }
        }),
        driverOnlineMongo: object => new Promise(async (resolve, reject) => {
            if (object.Drivers.length > 0 && (object.runningDelivery !== true || object.runningTaxiDriver !== true)) {
                try {
                    await LastLocation.update({driver_id: object.Drivers[0].dataValues.id}, {$set: {status: true, ocuped: false, accept: false}})
                    await LogDriver.create({driver_id: object.Drivers[0].dataValues.id, status: true, description: 'Motorista efetuou o Login'})
                    resolve(object)
                } catch (err) {
                    reject(err)
                }
            } else {
                resolve(object)
            }
        }),
        driverLogout: object => Driver.update({status: false}, {where: {id: object.id}}),
        userLogout: (user) => Users.update({token: null}, {where: {id: user.object.id}}),
        shopLogout: (shop) => Shop.update({token: null}, {where: {id: shop.object.id}}),
        mongodbStatus: object => async update => {
            await LogDriver.create({driver_id: object.id, status: false, description: 'Motorista efetuou o Logout'})
            return LastLocation.update({driver_id: object.id}, {$set: {status: false}})
        }
    }
}
