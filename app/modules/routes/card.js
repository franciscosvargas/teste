module.exports = app => {
    const url = `${app.config.url}/card`
    const Controller = require('../controllers/cards')(app)
    const Validate = require('../validates/card')(app)

    app.route(url)
        .get(app.jwt, Controller.listAll)
        .post(app.jwt, Validate.create, Controller.create)

    app.route(`${url}/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)
        .delete(app.jwt, Validate.delete, Controller.delete)

    app.route(`${url}/company/:id`)
        .get(app.jwt, Validate.listOne, Controller.listAllCompanyInCard)

    app.route(`${url}/company`)
        .post(app.jwt, Validate.company, Controller.create)

    app.route(`${url}/user/:user_id`)
        .get(app.jwt, Validate.listUser, Controller.listAllUser)

    app.route(`${url}/company/:company_id`)
        .get(app.jwt, Validate.listOneCompany, Controller.listAllCompany)
}
