module.exports = app => {
    const url = `${app.config.url}/requestdelivery`
    const Controller = require('../controllers/requestDelivery')(app)
    const Validate = require('../validates/requestDelivery')(app)

    app.route(`${url}/company`)
        .post(app.jwt, Validate.create, Controller.create)
        .get(app.jwt, Controller.listAll)

    app.route(`${url}/:id`)
        .put(app.jwt, Validate.listOne, Controller.update)

    app.route(`${url}/company/:id`)
        .delete(app.jwt, Validate.delete, Controller.delete)
        .get(app.jwt, Validate.listOne, Controller.listOne)

    app.route(`${url}/company/all/:company_id`)
        .get(app.jwt, Validate.listOneCompany, Controller.listOneCompany)

    app.route(`${url}/company/complete`)
        .post(app.jwt, Validate.complete, Controller.complete)

    app.route(`${url}/company/delete`)
        .post(app.jwt, Validate.complete, Controller.deleteCompany)

    app.route(`${url}/user/complete`)
        .post(app.jwt,
            Validate.complete, Validate.isPromocode,
            Validate.isPromocodeValidateUserDelivery,
            Validate.isCard, Controller.completeUser)

    app.route(`${url}/company/location`)
        .post(app.jwt, Validate.locationCalculate, Controller.companyLocation)

    app.route(`${url}/user/location`)
        .post(Validate.locationCalculateUser,
            Controller.locationCalculateUser)

    app.route(`${url}/refund/:id`)
        .put(Validate.refund, Controller.refundRequest)
}
