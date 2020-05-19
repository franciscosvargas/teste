module.exports = app => {
    const url = `${app.config.url}/settings`
    const Controller = require('../controllers/setting')(app)

    app.route(`${url}/:type`)
        .get(Controller.find)

    app.route(`${url}/:type`)
        .put(Controller.update)
}
