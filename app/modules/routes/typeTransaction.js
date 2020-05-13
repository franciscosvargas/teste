module.exports = app => {
    const url = `${app.config.url}/typetransaction`
    const Controller = require('../controllers/typeTransaction')(app)
    const Validate = require('../validates/typeTransaction')(app)

    app.route(url)
        .get(Controller.listAll)
        .post(app.jwt, Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
