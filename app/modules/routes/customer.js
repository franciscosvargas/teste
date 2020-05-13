module.exports = app => {
    const url = `${app.config.url}/customer`
    const Controller = require('../controllers/customer')(app)
    // const Validate = require('../validates/customer')(app)

    // const Help = require('../../helpers/upload')

    app.route(`${url}/find`)
        .get(Controller.find)

    app.route(`${url}`)
        .post(Controller.create)
        .put(Controller.update)

    app.route(`${url}/:id`)
        .delete(Controller.delete)
}
