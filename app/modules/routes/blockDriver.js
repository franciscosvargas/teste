module.exports = app => {
    const url = `${app.config.url}/blockdriver`
    const Controller = require('../controllers/blockDriver')(app)
    const Validate = require('../validates/blockDriver')(app)

    app.route(`${url}/company/:company_id`)
        .get(app.jwt, Controller.listCompany)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .delete(app.jwt, Validate.listOne, Controller.delete)
}
