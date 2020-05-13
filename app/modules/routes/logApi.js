module.exports = app => {
    const url = `${app.config.url}/logapi`
    const Controller = require('../controllers/logApi')(app)

    app.route(`${url}`)
        .get(app.jwt, Controller.listAll)
}
