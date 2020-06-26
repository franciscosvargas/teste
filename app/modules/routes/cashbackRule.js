module.exports = app => {
    const url = `${app.config.url}/cashbackRule`
    const Controller = require('../controllers/cashbackRule')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Controller.create)
        .put(app.jwt, Controller.update)

    app.route(`${url}/:id/disable`)
        .put(app.jwt, Controller.disable)

    app.route(`${url}/:id`)
        .get(app.jwt, Controller.listOne)

    app.route(`${url}/sales/count/:cashback_rule_id?`)
        .get(app.jwt, Controller.count)
}
