module.exports = app => {
    const url = `${app.config.url}/typevehicles`
    const Controller = require('../controllers/typeVehicles')(app)
    const Validate = require('../validates/typeVehicles')(app)

    app.route(url)
        .get(Controller.listAll)
        .post(app.jwt, Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
