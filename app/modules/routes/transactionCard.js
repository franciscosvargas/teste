module.exports = app => {
    const url = `${app.config.url}/transaction`
    const Controller = require('../controllers/transactionsCard')(app)
    const Validate = require('../validates/transactionsCard')(app)

    app.route(`${url}/card`)
        .post(app.jwt, Validate.card, Controller.card)
        .get(app.jwt, Controller.listAll)

    app.route(`${url}/card/pagarme`)
        .post(Validate.postBackCard, Controller.postBackCard)

    app.route(`${url}/card/:id`)
        .get(app.jwt, Validate.listOne, Controller.listOne)

    app.route(`${url}/card/company/:company_id`)
        .get(app.jwt, Validate.listOne, Controller.listAllCompany)

    app.route(`${url}/card/taxi/finish/pagarme`)
        .post(Validate.postBackCard, Controller.taxiNewPagarme)

    // app.route(`${url}/card/reversal/:id`)
    //   .put(Validate.reversal, Controller.reversal)

    app.route(`${url}/company/:company_id`)
        .get(app.jwt, Validate.listOne, Controller.allTransaction)

    app.route(`${url}/card/delivery/pagarme`)
        .post(Validate.postBackCard, Controller.postBackCardDelivery)

    app.route(`${url}/card/taxi/pagarme`)
        .post(Validate.postBackCard, Controller.postBackCardTaxi)
}