module.exports = app => {
    const url = `${app.config.url}/transaction/deposit`
    const Controller = require('../controllers/transactionDeposit')(app)
    const Validate = require('../validates/transactionDeposit')(app)

    const Help = require('../../helpers/upload')

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Help.uploadImage.single('receipt'), Validate.create, Controller.create)

    app.route(`${url}/company/:company_id`)
        .get(app.jwt, Validate.listOne, Controller.listAllCompany)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .put(app.jwt, Help.uploadImage.single('receipt'), Validate.update, Controller.update)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/validate/:id`)
        .put(app.jwt, Validate.validate, Controller.validate)
}
