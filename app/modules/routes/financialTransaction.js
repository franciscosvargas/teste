module.exports = app => {
    const url = `${app.config.url}/financialTransaction`
    const Controller = require('../controllers/financialTransaction')(app)
    const Validate = require('../validates/financialTransaction')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)

    app.route(`${url}/:id/pdf`)
        .get(app.jwt, Validate.isId, Controller.export)

    app.route(`${url}/revenues`)
        .post(Validate.revenues, Controller.revenues)
}
