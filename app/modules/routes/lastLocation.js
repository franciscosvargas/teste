module.exports = (app, eventEmitter) => {
    const url = `${app.config.url}/lastlocation`
    const Controller = require('../controllers/lastLocation')(app)
    const Validate = require('../validates/lastLocation')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/closer`)
        .post(app.jwt, Validate.searchDriver, Controller.closer)

    app.route(`${url}/driver/:driver_id`)
        .put(app.jwt, Validate.update, Controller.update(eventEmitter))
        .get(app.jwt, Validate.listOneDriver, Controller.listOne)
}
