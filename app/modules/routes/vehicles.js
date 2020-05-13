module.exports = app => {
    const url = `${app.config.url}/vehicles`
    const Controller = require('../controllers/vehicles')(app)
    const Validate = require('../validates/vehicles')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(Validate.create, Validate.unique, Validate.vehiclesUse, Validate.haveVehicle, Controller.create)

    app.route(`${url}/new`)
        .post(app.jwt, Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/vehiclesandservice`)
        .post(Validate.createService, Controller.createService)

    app.route(`${url}/user/:user_id`)
        .get(Validate.listByUser, Controller.listByUser)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/driver/:user_id`)
        .get(app.jwt, Validate.listOneDriver, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)

    app.route(`${url}/plate/:plate`)
        .get(Validate.plate)
}



