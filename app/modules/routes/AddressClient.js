module.exports = app => {
    const url = `${app.config.url}/addressclient`
    const Controller = require('../controllers/addressclient')(app)
    const Validate = require('../validates/addressclient')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
