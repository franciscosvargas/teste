module.exports = app => {
    const Errors = require('../../errors/promoCodeUser/pt-br')
    const PromoCodeUser = app.datasource.models.PromoCodeUser
    const PromoCode = app.datasource.models.PromoCode
    const RequestDelivery = app.datasource.models.RequestDelivery
    const RequestTaxiDriver = app.datasource.models.RequestTaxiDriver
    const moment = require('moment')
    return {
        create: (req, res, next) => {
            req.assert('user_id', Errors.userId).notEmpty()
            req.assert('promo_code_id', Errors.promoCodeId).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        uniqueUser: (req, res, next) => {
            PromoCodeUser.findOne({
                where: {
                    $and: [
                        {user_id: req.body.user_id},
                        {promo_code_id: req.body.promo_code_id}
                    ]
                },
                raw: true
            })
                .then(promocode => promocode ? res.status(400).json([{title: 'PromoCode', message: 'Usuário possui este cupom'}]) : next())
                .catch(err => res.status(400).json(err))
        },
        promoCodeIsExist: (req, res, next) => {
            let initDate = moment().utcOffset(0).set({hour: 0, minute: 0, second: 0, millisecond: 1})
            PromoCode.findOne({
                where: {
                    $and: [
                        {id: req.body.promo_code_id},
                        {amount: {$gt: 0}},
                        {expirateDate: {$gt: initDate}}
                    ]
                },
                raw: true
            })
                .then(resp => {
                    if (resp) {
                        req.body.service_id = resp.service_id
                        req.body.amount = resp.amount
                        next()
                    } else {
                        res.status(400).json([{title: 'Cupom', message: 'Cupom Inválido!'}])
                    }
                })
        },
        uniquePromoCodeService: (req, res, next) => {
            let initDate = moment().utcOffset(0).set({hour: 0, minute: 0, second: 0, millisecond: 1})
            PromoCodeUser.findOne({
                where: {
                    user_id: req.body.user_id
                },
                include: [
                    {
                        model: PromoCode,
                        where: {
                            $and: [
                                {expirateDate: {$gt: initDate}},
                                {status: true},
                                {amount: {$gt: 0}},
                                {service_id: req.body.service_id}
                            ]
                        },
                        required: true
                    }
                ]
            })
                .then(resp => resp ? res.status(400).json([Errors.promoCodeNotPermit]) : next())
                .catch(err => res.status(500).json(err))
        },
        countPromoCodeDelivery: (req, res, next) => {
            RequestDelivery.count({
                where: {
                    promo_code_id: req.body.promo_code_id
                }
            })
                .then(resp =>
                    (resp > req.body.amountPerUser > res && req.body.amount > resp)
                        ? res.status(400).json(Errors.promoInvalid) : next())
                .catch(err => res.status(500).json(err))
        },
        countPromoCodeTaxi: (req, res, next) => {
            RequestTaxiDriver.count({
                where: {
                    promo_code_id: req.body.promo_code_id
                }
            })
                .then(resp =>
                    (resp > req.body.amountPerUser > res && req.body.amount > resp)
                        ? res.status(400).json(Errors.promoInvalid) : next())
                .catch(err => res.status(500).json(err))
        },
        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        update: (req, res, next) => {
            if (isNaN(req.params.id)) {
                res.json([Errors.idInvalid])
            } else {
                req.assert('user_id', Errors.userId).optional()
                req.assert('promo_code_id', Errors.promoCodeId).optional()
                const error = req.validationErrors()
                error ? res.status(400).json(error) : next()
            }
        },
        delete: (req, res, next) => isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next()
    }
}
