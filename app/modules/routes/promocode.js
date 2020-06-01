module.exports = app => {
    const url = `${app.config.url}/promocode`
    const Controller = require('../controllers/promocode')(app)
    const Validate = require('../validates/promocode')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Controller.create)
        .put(app.jwt, Controller.update)

    app.route(`${url}/validate/:code`)
        .post(app.jwt, Validate.isCode)

    app.route(`${url}/:id/disable`)
        .put(app.jwt, Controller.disable)

    app.route(`${url}/:id`)
        .get(app.jwt, Controller.listOne)
}
