module.exports = app => {
    const url = `${app.config.url}/cityservice`
    const Controller = require('../controllers/cityService')(app)
    const Validate = require('../validates/cityService')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Validate.unique, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/city/:city_id`)
        .get(app.jwt, Validate.listCity, Controller.listAllQuery)
}
