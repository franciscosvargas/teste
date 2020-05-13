module.exports = (app, eventEmitter) => {
    const url = `${app.config.url}/runningtaxi`
    const Controller = require('../controllers/runningTaxi')(app)
    const Validate = require('../validates/runningTaxi')(app)

    app.route(`${url}/test`)
        .get(app.jwt, Controller.testEmail)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.listOne, Controller.update)

    app.route(`${url}/user/:user_id/status/:status`)
        .get(app.jwt, Validate.listOneUserStatus, Controller.listOneUserStatus)

    app.route(`${url}/user/:user_id/`)
        .get(app.jwt, Validate.listRuningUser, Controller.listRuningUser)

    app.route(`${url}/user/:user_id/status/:status/lastday/:lastDay`)
        .get(app.jwt, Validate.listRuningUserLastday, Controller.listRuningUserLastday)

    app.route(`${url}/accept/:id`)
        // .put(app.jwt, Validate.accept, Validate.isRunningOpen, Validate.isAccept, Validate.active, Controller.accept(eventEmitter))
        .put(app.jwt, Validate.accept, Validate.isAccept, Validate.active, Controller.accept(eventEmitter))

    app.route(`${url}/cancel/driver/:id`)
        .put(app.jwt, Validate.isCancel, Controller.cancelDriver)

    app.route(`${url}/cancel/running/driver/:id`)
        .put(app.jwt, Validate.accept, Validate.isCancelRunning, Controller.cancelRunningDriver(eventEmitter))

    app.route(`${url}/cancel/user/:id`)
        .put(app.jwt, Validate.listOne, Controller.cancelUser)

    app.route(`${url}/progress/:id`)
        // .put(app.jwt, Validate.accept, Validate.isLatLngUpdate, Validate.isAddressMysql, Controller.progress(eventEmitter))
        .put(app.jwt, Validate.accept, Validate.isLatLngUpdate, Controller.progress(eventEmitter))

    app.route(`${url}/finish/:id`)
        .put(app.jwt, Validate.isFinishReturn, Validate.isFinish, Controller.finish(eventEmitter))

    app.route(`${url}/extract/driver/:driver_id/status/:status/lastday/:lastDay`)
        .post(app.jwt, Validate.extractDriver, Controller.extractDriver)

    app.route(`${url}/user/historic/service/:service_id`)
        .post(app.jwt, Validate.statusService, Controller.userHistoric)

    app.route(`${url}/confirm-user-identity/:id`)
        .post(app.jwt, Validate.accept, Controller.confirmUserIdentity(eventEmitter))

    app.route(`${url}/deny-user-identity/:id`)
        .post(app.jwt, Validate.accept, Controller.denyUserIdentity(eventEmitter))

    app.route(`${url}/confirm-provider-identity/:id`)
        .post(app.jwt, Validate.accept, Controller.confirmProviderIdentity(eventEmitter))

    app.route(`${url}/deny-provider-identity/:id`)
        .post(app.jwt, Validate.accept, Controller.denyProviderIdentity(eventEmitter))
}

/*

*/

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
    11 -> Preaprovado
    12 -> Dividendo
*/
