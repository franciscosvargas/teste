module.exports = app => {
    const url = `${app.config.url}/servicesuit`
    const Controller = require('../controllers/serviceSuit')(app)
    const Validate = require('../validates/serviceSuit')(app)

    app.route(url)
        .get(Controller.listAll)
        .post(app.jwt, Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
