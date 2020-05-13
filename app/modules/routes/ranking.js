module.exports = app => {
    const url = `${app.config.url}/ranking`
    const Controller = require('../controllers/ranking')(app)
    const Validate = require('../validates/ranking')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Validate.unique, Controller.create)

    app.route(`${url}/:ranking_id/reports`)
        .get(app.jwt, Controller.listAllRanking)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)
}
