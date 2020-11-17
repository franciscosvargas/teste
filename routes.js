const PATH = './app/modules/routes'
const fs = require('fs')

module.exports = (app, eventEmitter) => {
        fs.readdirSync('./app/modules/routes/')
        .filter(f => !f.startsWith('.'))
        .forEach((el, i) => {
            require(`${PATH}/${el}`)(app, eventEmitter)
        }) 
}
