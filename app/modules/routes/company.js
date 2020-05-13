module.exports = app => {
    const url = `${app.config.url}/company`
    const Controller = require('../controllers/company')(app)
    const Validate = require('../validates/company')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/search/:cnpj`)
        .get(Validate.isExistCnpj)

    app.route(`${url}/search/cnpj`)
        .post(Validate.searchCnpj)
}
