module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')
    return {
        create: object => new Promise((resolve, reject) => {
            try {
                // object.code = Generator.promocode()
                object.expirateDate = moment(object.expirateDate)
                resolve(object)
            } catch (err) {
                reject({
                    title: 'Error',
                    message: 'Error em Gerar o Código!'
                })
            }
        })
    }
}
