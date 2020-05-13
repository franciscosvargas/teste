module.exports = app => {
    const url = `${app.config.url}/services`
    const Controller = require('../controllers/services')(app)
    const Validate = require('../validates/services')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/location`)
        .post(Controller.locationService)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
