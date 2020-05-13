module.exports = app => {
    const url = `${app.config.url}/discount`
    const Controller = require('../controllers/discount')(app)
    const Validate = require('../validates/discount')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
