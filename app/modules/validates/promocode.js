module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')
    const Errors = require('../../errors/promocode/pt-br')
    const PromoCode = app.datasource.models.PromoCode
    const City = app.datasource.models.City
    const State = app.datasource.models.State
    const Country = app.datasource.models.Country

    return {
        create: (req, res, next) => {
            console.log(req.body)
            req.assert('name', Errors.name).notEmpty()
            req.assert('amount', Errors.amount).notEmpty()
            req.assert('code', Errors.code).notEmpty()
            req.assert('value', Errors.value).notEmpty()
            req.assert('amountPerUser', Errors.amountPerUser).notEmpty()
            req.assert('billingType', Errors.billingType).notEmpty()
            req.assert('typePayment', Errors.typePayment).notEmpty()
            req.assert('city_id', Errors.cityId).optional()
            req.assert('country_id', Errors.countryId).optional()
            req.assert('state_id', Errors.stateId).optional()
            req.assert('expirateDate', Errors.expirateDate).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },

        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        isCode: (req, res, next) => {
            req.assert('city_id', Errors.cityId).notEmpty()
            req.assert('state_id', Errors.countryId).notEmpty()
            req.assert('country_id', Errors.countryId).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                let initDate = moment().utcOffset(0).set({hour: 0, minute: 0, second: 0, millisecond: 1})
                let finishDate = moment().utcOffset(0).set({hour: 23, minute: 59, second: 59, millisecond: 59})
                PromoCode.findOne({
                    where: {
                        $and: [
                            {
                                code: req.params.code
                            },
                            {
                                status: true
                            },
                            {
                                expirateDate: {$ne: {$between: [initDate.toISOString(), finishDate.toISOString()]}}
                            }
                        ]
                    },
                    include: [
                        {
                            model: City,
                            where: {id: req.body.city_id}
                        },
                        {
                            model: State,
                            where: {id: req.body.state_id}
                        },
                        {
                            model: Country,
                            where: {id: req.body.country_id}
                        }
                    ]
                })
                    .then(promocode => promocode ? res.status(200).json({promocode: true, data: promocode}) : res.status(400).json([Errors.promoCodeInvalid]))
                    .catch(err => res.status(500).json(err))
            }
        },

        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.json([Errors.idInvalid])
            } else {
                req.assert('name', Errors.name).notEmpty()
                req.assert('amount', Errors.amount).notEmpty()
                req.assert('value', Errors.value).notEmpty()
                req.assert('code', Errors.code).notEmpty()
                req.assert('amountPerUser', Errors.amountPerUser).notEmpty()
                req.assert('billingType', Errors.billingType).notEmpty()
                req.assert('typePayment', Errors.typePayment).notEmpty()
                req.assert('expirateDate', Errors.expirateDate).notEmpty()
                req.assert('city_id', Errors.cityId).optional()
                req.assert('country_id', Errors.countryId).optional()
                req.assert('state_id', Errors.countryId).optional()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },
        delete: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next()

    }
}
