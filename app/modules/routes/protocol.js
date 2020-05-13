module.exports = app => {
    const url = `${app.config.url}/protocol`
    const Controller = require('../controllers/protocol')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)

    app.route(`${url}/:id`)
        .get(app.jwt, Controller.listOne)

    app.route(`${url}/:id/send_message`)
        .post(app.jwt, Controller.sendMessage)
}
