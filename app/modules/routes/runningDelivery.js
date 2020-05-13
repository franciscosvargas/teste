module.exports = (app, eventEmitter) => {
    const url = `${app.config.url}/runningdelivery`
    const Controller = require('../controllers/runningDelivery')(app)
    const Validate = require('../validates/runningDelivery')(app)

    app.route(`${url}/:id/assignment`)
        .post(Validate.listOne, Validate.isAccept, Controller.runningAssignmentOneDriver)

    app.route(`${url}/:id/freedriver/`)
        .put(app.jwt, Validate.isFree, Controller.freeDriver)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.listOne, Controller.update)

    app.route(`${url}/company/:company_id/toDay`)
        .get(app.jwt, Validate.companyIsId, Controller.toDay)

    app.route(`${url}/company/:company_id/status/:status`)
        .get(app.jwt, Validate.listRuningCompany, Controller.listRuningCompany)

    app.route(`${url}/company/:company_id/`)
        .get(app.jwt, Validate.listRuningCompanyNotStatus, Controller.listRuningCompanyNotStatus)

    app.route(`${url}/company/:company_id/status/:status/lastday/:lastDay`)
        .get(app.jwt, Validate.listRuningCompanyLastday, Controller.listRuningCompanyLastday)

    app.route(`${url}/:id/status/:status`)
        .get(app.jwt, Validate.listOneStatus, Controller.listOneStatus)

    app.route(`${url}/:id/copy`)
        .get(app.jwt, Validate.listOne, Controller.copy)

    app.route(`${url}/accept/:id`)
        .put(app.jwt, Validate.accept, Validate.isAccept, Validate.active, Validate.isRunningOpenDriverDelivery, Validate.isRunningOpenDriverTaxi, Controller.accept(eventEmitter))

    app.route(`${url}/cancel/driver/:id`)
        .put(app.jwt, Validate.accept, Validate.active, Controller.cancelDriver)

    app.route(`${url}/cancel/running/driver/:id`)
        .put(Validate.active, Validate.isPossibleCancel, Controller.cancelRunningDriver(eventEmitter))

    app.route(`${url}/cancel/user/:id`)
        .put(app.jwt, Validate.listOne, Validate.active, Controller.cancelUser)

    app.route(`${url}/cancel/company/:id`)
        .put(app.jwt, Validate.listOne, Validate.isPossible, Controller.cancelUser)

    app.route(`${url}/progress/:id/free`)
        .put(app.jwt, Validate.listOne, Controller.freeProgress)

    app.route(`${url}/progress/:id`)
        .put(app.jwt, Validate.accept, Validate.active, Validate.isProgress, Controller.progress(eventEmitter))

    app.route(`${url}/finish/:id`)
        .put(app.jwt, Validate.accept, Validate.active, Validate.isReturn, Controller.finish(eventEmitter))

    app.route(`${url}/finishByDash/:id`)
        .put(app.jwt, Validate.accept, Validate.active, Controller.finishFreeDriver)

    app.route(`${url}/extract/driver/:driver_id/status/:status/lastday/:lastDay`)
        .get(Validate.extractDriver, Controller.extractDriver)

    app.route(`${url}/:driver_id/currentWeek`)
        .get(app.jwt, Validate.findByDriver, Controller.currentWeekByDriver)

    app.route(`${url}/user/historic/service/:service_id`)
        .post(app.jwt, Validate.statusService, Controller.userHistoric)
}

/*
    1 -> não paga
    2 -> paga
    3 -> procurando
    4 -> em andamento
    5 -> Recebido
    6 -> Finalizado
    7 -> Não tem Motorista
    8 -> Cartão não aprovado
    9 -> Cancelado
    10 -> Scores
    11 -> Transaction Card Taxi
*/
