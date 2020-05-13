module.exports = app => {
    const url = `${app.config.url}/logsendnotification`
    const Controller = require('../controllers/logSendNotificationRunning')(app)
    const Validate = require('../validates/logSendNotificationRunning')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)

    app.route(`${url}/:running_taxi_driver_id/particular`)
        .get(app.jwt, Validate.listOneParticular, Controller.listOne)

    app.route(`${url}/:running_delivery_id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .delete(app.jwt, Validate.delete, Controller.delete)

    
}

