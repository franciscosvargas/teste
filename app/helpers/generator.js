module.exports = app => {
    function makeid (length) {
        var result = ''
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        var charactersLength = characters.length
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    }

    return {
        token: (object) => {
            const jwt = require('jsonwebtoken')
            const key = require('../config/key')
            return jwt.sign(object, key.token, {algorithm: 'HS256'})
        },
        active: () => {
            function digit4 () {
                return Math.floor((1 + Math.random()) * 0x10000)
            }

            return digit4() + digit4()
        },
        plate: () => `ìboltt-${Math.floor((Math.random()) * 0x10000)}`,
        promocode: () => Math.random().toString(36).slice(2),
        memberCode: () => {
            function digit4 () {
                return Math.floor((1 + Math.random()) * 0x10000)
            }

            return digit4() + digit4() + digit4()
        },
        protocolCode: () => {
            // 23111950B61
            const monthDay = (new Date().getDate()).toString()
            const month = ((new Date().getMonth()) + 1).toString()
            const year = (new Date().getFullYear()).toString()
            const randomUnique = makeid(5).toString()

            return monthDay + month + year + randomUnique
        },
        generateUUID: () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    }
}
