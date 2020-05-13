module.exports = app => {
    const url = `${app.config.url}/reports`
    const Controller = require('../controllers/reports')(app)

    app.route(`${url}/running`)
        .post(app.jwt, Controller.reportsRunning)

}