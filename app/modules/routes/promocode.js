module.exports = app => {
    const url = `${app.config.url}/promocode`
    const Controller = require('../controllers/promocode')(app)
    const Validate = require('../validates/promocode')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Controller.create)

    app.route(`${url}/validate/:code`)
        .post(app.jwt, Validate.isCode)

    app.route(`${url}/:id/block`)
        .put(app.jwt, Validate.listOne, Controller.block)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
}
