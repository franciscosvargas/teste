module.exports = app => {
    const url = `${app.config.url}/paymenttypeflag`
    const Controller = require('../controllers/paymentTypeFlag')(app)
    const Validate = require('../validates/paymentTypeFlag')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/paymentType/:payment_type_id`)
        .get(app.jwt, Validate.paymentType, Controller.listAllQuery)
}
