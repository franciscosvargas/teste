module.exports = app => {
    const url = `${app.config.url}/extractdaily`
    const Controller = require('../controllers/extractDaily')(app)
    const Validate = require('../validates/extractDaily')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)

    app.route(`${url}/driver/:driver_id/service/:service_id/delivery`)
        .get(Validate.listExtract, Controller.extractDayDriverDelivery)

    app.route(`${url}/driver/:driver_id/service/:service_id/taxi/`)
        .get(app.jwt, Validate.listExtract, Controller.extractDayDriverTaxi)

    app.route(`${url}/delivery/day/:time/service/:service_id/driver/:driver_id`)
        .get(app.jwt, Validate.listExtract, Controller.extractDayDelivery)

    app.route(`${url}/taxi/day/:time/service/:service_id/driver/:driver_id`)
        .get(app.jwt, Validate.listExtract, Controller.extractDayTaxi)

    app.route(`${url}/payment/between`)
        .post(app.jwt, Validate.paymentBetween, Controller.paymentBetween)
}
