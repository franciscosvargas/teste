module.exports = app => {
    const url = `${app.config.url}/drivers`
    const Controller = require('../controllers/driver')(app)
    const Validate = require('../validates/driver')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)

    app.route(`${url}/:id/reset`)
        .get(app.jwt, Controller.reset)

    app.route(`${url}/raceline`)
        .get(app.jwt, Controller.listRaceLine)

    app.route(`${url}/company/:company_id`)
        .get(app.jwt, Validate.listCompany, Controller.listAllDriversByCompany)

    app.route(`${url}/filter`)
        .post(app.jwt, Controller.listAllFilter)

    app.route(`${url}/filter/name`)
        .post(app.jwt, Controller.listOneDriverFilter)

    app.route(`${url}/:id/running/test`)
        .get(Controller.runningTest)

    app.route(`${url}/freedom`)
        .post(app.jwt, Controller.unlock)

    app.route(`${url}/:id/unlock/company/runningdelivery`)
        .post(app.jwt, Validate.unlockCompany, Controller.unlockCompany)

    app.route(`${url}/:id`)
        .put(Validate.update, Controller.update)
        .get(app.jwt, Validate.listOne, Controller.listOne)

    app.route(`${url}/user/:id`)
        .get(app.jwt, Validate.listOneDriver, Controller.listOneDriver)

    app.route(`${url}/status/:id`)
        .put(app.jwt, Validate.setStatus, Validate.isRunningDelivery, Validate.isRunningTaxi, Controller.setStatus)

    app.route(`${url}/push/:id`)
        .post(app.jwt, Validate.pushNotification, Controller.pushNotification)

    app.route(`${url}/:id/active`)
        .put(app.jwt, Validate.active, Validate.activeFalse, Controller.active)

    app.route(`${url}/push/taxi/:id`)
        .post(Validate.pushNotification, Controller.pushNotificationTaxi)

    app.route(`${url}/update`)
        .post(Validate.updatePost, Controller.updatePost)

    app.route(`${url}/online/city/:city_id`)
        .get(app.jwt, Controller.listOnlineAll)

    app.route(`${url}/:id/historic/running`)
        .post(app.jwt, Validate.historicRunning, Controller.historicRunning)

    app.route(`${url}/setup/:id`)
        .post(app.jwt, Validate.setup, Controller.setup)

}
