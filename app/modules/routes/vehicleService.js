module.exports = app => {
    const url = `${app.config.url}/vehicleservice`
    const Controller = require('../controllers/vehicleService')(app)
    const Validate = require('../validates/vehicleService')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/vehicle/:vehicle_id`)
        .get(app.jwt, Validate.listVehicleOne, Controller.listOne)
}
