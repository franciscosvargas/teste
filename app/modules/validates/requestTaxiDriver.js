module.exports = app => {
    const Errors = require('../../errors/requestTaxiDriver/pt-br')
    const Help = require('../../helpers/searchPointAnddress')(app)
    const PromoCodeUser = app.datasource.models.PromoCodeUser
    const PromoCode = app.datasource.models.PromoCode
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const RequestTaxiDriver = app.datasource.models.RequestTaxiDriver
    return {
        create: (req, res, next) => {
            req.assert('clientLat', Errors.clientLat).notEmpty()
            req.assert('clientLng', Errors.clientLng).notEmpty()
            req.assert('destinationLat', Errors.destinationLat).notEmpty()
            req.assert('destinationLng', Errors.destinationLng).notEmpty()
            req.assert('user_id', Errors.userId).notEmpty()
            req.assert('service_id', Errors.serviceId).notEmpty()
            req.assert('promo_code_id', Errors.promocodeId).optional()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Help.pointAddressTaxi(req.body)
                    .then(response => response ? next() : res.status(400).json([Errors.calculateRoute]))
                    .catch(err => res.status(400).json(err))
            }
        },
        isPromocode: (req, res, next) =>
            (req.body.promo_code_id)
                ? PromoCodeUser.findOne({
                    where: {
                        $and: [
                            {promo_code_id: req.body.promo_code_id},
                            {user_id: req.body.user_id}
                        ]
                    },
                    include: [
                        {model: PromoCode, where: {id: req.body.promo_code_id, typePayment: req.body.typePayment}}
                    ]
                })
                    .then(promocode => {
                        if (promocode) {
                            req.body.promocode = promocode.dataValues.PromoCode.dataValues
                            next()
                        } else {
                            res.status(400).json([Errors.promocodeId])
                        }
                    })
                    .catch(err => res.status(500).json(err))
                : next(),
        isPromocodeValidateUserTaxi: (req, res, next) =>
            (req.body.promo_code_id)
                ? RequestTaxiDriver.count({
                    where: {
                        $and: [
                            {
                                user_id: req.body.user_id
                            }, {
                                promo_code_id: req.body.promo_code_id
                            }
                        ]
                    },
                    include: [
                        {
                            model: RunningTaxiDriver,
                            required: true,
                            where: {status: {$in: [6, 10]}}
                        }
                    ]
                })
                    .then(resp => {
                        if (resp.length === 0) {
                            next()
                        } else {
                            if ((parseInt(resp) === req.body.promocode.amountPerUser)) {
                                res.status(400).json([{title: 'Código Promocional', message: 'Código promocional inválido!'}])
                            } else if (parseInt(resp) === req.body.promocode.amount) {
                                res.status(400).json([{title: 'Código Promocional', message: 'Código promocional inválido!'}])
                            } else {
                                next()
                            }
                        }
                    })
                    .catch(err => console.log(err))
                : next()
    }
}
