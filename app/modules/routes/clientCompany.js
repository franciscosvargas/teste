module.exports = app => {
    const url = `${app.config.url}/clientcompany`
    const Controller = require('../controllers/clientCompany')(app)
    const Validate = require('../validates/clientCompany')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/phone/:phone/company/:id`)
        .get(Validate.searchPhone, Controller.searchPhone)
}
