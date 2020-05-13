module.exports = app => {
    const url = `${app.config.url}/typesvehiclesservice`
    const Controller = require('../controllers/typesVehiclesService')(app)
    const Validate = require('../validates/typesVehiclesService')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/vehicles/:type_vehicle_id`)
        .get(Validate.listTypeVehicles, Controller.listTypeVehicles)
}
