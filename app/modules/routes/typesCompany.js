module.exports = app => {
    const url = `${app.config.url}/typecompany`
    const Controller = require('../controllers/typesCompany')(app)
    const Validate = require('../validates/typesCompany')(app)

    app.route(url)
        .get(Controller.listAll)
        .post(app.jwt, Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
