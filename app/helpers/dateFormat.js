const moment = require('moment')
module.exports = ({
    utc: (date, format) => {
        const params = format || 'YYYY/MM/DD HH:mm:ss'
        return moment(date).format(params)
        // return date.toLocaleString('pt-BR', {timeZone: 'America/Recife'})
    }
})

