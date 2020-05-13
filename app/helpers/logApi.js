var expressWinston = require('express-winston')
var winston = require('winston')

expressWinston.requestWhitelist.push('body')
expressWinston.responseWhitelist.push('body')

const log = () => {
    return expressWinston.logger({
        transports: [
            new winston.transports.Console({
                json: true,
                colorize: true,
                level: 'info',
                handleExceptions: true
            }),
            new winston.transports.File({
                name: 'logiuvo_club',
                filename: 'logiuvo_club.json',
                level: 'info',
                maxsize: 5242880, //5MB
                maxFiles: 10,
                json: true,
                colorize: true
            })
        ],
        exitOnError: false,
        // meta: true,
        expressFormat: true,
        ignoreRoute: function (req, res) { return false }
    })
}

module.exports = {
    log
}
