module.exports = app => {
    const url = `${app.config.url}/holidays`
    const Controller = require('../controllers/holidays')(app)
    const Validate = require('../validates/holidays')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
