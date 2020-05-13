module.exports = app => {
    const LastLocation = require('../../modules/models/lastLocation')
    const Driver = app.datasource.models.Driver
    const LogDriver = app.datasource.models.LogDriver
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')

    function isDriver(reject) {
        return reject({
            title: 'Motorista',
            message: 'Motorista não existe!'
        })
    }

    function driverId(reject) {
        return reject({
            title: 'Motorista Id',
            message: 'Motorista Id é requerido!'
        })
    }

    const returnUpdate = (object) => object.nModified ? {
        title: 'Alterado com sucesso!',
        message: 'Conseguimos alterar o seu registro com sucesso!'
    } : {
            title: 'Error em alterar!',
            message: 'Não foi possivel efetuar atualização, tente novamente!'
        }

    return {
        validateDriver: (object) => {
            return new Promise((resolve, reject) => {
                Driver.findById(parseInt(object.driver_id))
                    .then(driver => driver ? resolve(driver) : isDriver(reject))
                    .catch(reject)
            })
        },
        createLogDriver: object => {
            return LogDriver.create({
                driver_id: object.driver_id,
                status: true,
                description: 'Prestador setado para livre novamente"'
            })
        },
        isOfflineDriver: object => {
            return Driver.findOne({ where: { id: object.driver_id, status: false } })
        },
        validateObject: (object) => {
            return new Promise((resolve, reject) => {
                isNaN(object.driver_id) ? resolve(object) : driverId(reject)
            })
        },
        updateLocation: async (object) => {
            try {
                let utc = new Date()
                utc.setHours(utc.getHours() - 3)
                await Driver.update({ status: true }, { where: { id: object.driver_id } })
                // online forever
                const last = await LastLocation.update({ driver_id: object.driver_id }, { $set: { locate: [object.lng, object.lat], status: true, lat_timestamp: utc } })
                console.log('lastLocation fiz o update', last)
                Promise.resolve()
            } catch (err) {
                Promise.reject(err)
            }
        }
    }
}
