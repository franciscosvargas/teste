module.exports = (app, eventEmitter) => {
    const url = `${app.config.url}/gobot`
    const Controller = require('../controllers/gobot')(app, eventEmitter)

    app.route(`${url}/webhook`)
        .post(Controller.webhook)
}
