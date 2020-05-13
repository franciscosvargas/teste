module.exports = app => {
    const url = `${app.config.url}/bank`
    const Controller = require('../controllers/bank')(app)
    const Validate = require('../validates/bank')(app)

    app.route(`${url}/driver/:user_id`)
        .get(app.jwt, Validate.listOneUser, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
