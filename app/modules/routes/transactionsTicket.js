module.exports = app => {
    const url = `${app.config.url}/transaction`
    const Controller = require('../controllers/transactionsTicket')(app)
    const Validate = require('../validates/transactionsTicket')(app)

    app.route(`${url}/ticket`)
        .post(app.jwt, Validate.ticket, Controller.ticket)
        .get(app.jwt, Controller.listAll)

    app.route(`${url}/ticket/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)

    app.route(`${url}/ticket/company/:company_id`)
        .get(app.jwt, Validate.listOne, Controller.listAllCompany)

    app.route(`${url}/ticket/pagarme`)
        .post(Validate.postBackTicket, Controller.postBackTicket)

    app.route(`${url}/ticket/company/:company_id`)
        .get(app.jwt, Validate.listTicketCompany, Controller.listTickerCompany)
}
