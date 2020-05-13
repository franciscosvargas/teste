module.exports = app => {
    const url = `${app.config.url}/companyuser`
    const Controller = require('../controllers/companyUser')(app)
    const Validate = require('../validates/companyUser')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/company/:company_id`)
        .get(app.jwt, Controller.listAll)
}
