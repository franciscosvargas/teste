module.exports = app => {
    const url = `${app.config.url}/scores`
    const Controller = require('../controllers/scores')(app)
    const Validate = require('../validates/scores')(app)

    app.route(url)
        .post(app.jwt, Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)

    app.route(`${url}/driver/:driver_id`)
        .get(app.jwt, Controller.listAllDriver)

    app.route(`${url}/average/:driver_id`)
        .get(Validate.average, Controller.average)
}
