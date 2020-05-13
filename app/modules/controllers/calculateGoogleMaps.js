module.exports = app => {
    const Help = require('../../helpers/googleMaps')

    const Business = require('../business/taxi')(app)

    const Company = require('../business/company')(app)

    return {
        companyCalculate: async (req, res) => {
            try {
                const calculate = await Help.calculatePointAddress(req.body.query)
                calculate.destinationAddresses[0] = req.body.query.address_client
                calculate.originAddresses[0] = req.body.query.adress_company
                res.status(200).json(calculate)
            } catch (err) {
                res.status(400).json(err)
            }
        },
        taxiCalculate: (req, res) =>
            Business.validateRates(req.body)
                .then(Business.calculateTaximeter)
                .then(Help.calculatePointAddressTaxi)
                .then(Business.listOnePromoCode(req))
                .then(Business.isValidateCupomTaxi(req))
                .then(Business.isValidateUse(req))
                .then(calculate => res.status(200).json(calculate))
                .catch(err => res.status(400).json(err)),

        locationCalculate: async (req, res) => {
            try {
                const validateRates = await Business.validateRates(req.body)
                const companyTratmnet = await Company.tratmentQuery(validateRates)
                const calculate = await Help.calculatePointAddress(companyTratmnet)
                const listOnePromoCode = await Business.listOnePromoCode(req)(calculate)
                const isValidate = await Business.isValidateCupomDelivery(req)(listOnePromoCode)
                const isValidateUser = await Business.isValidateUse(req)(isValidate)
                res.status(200).json(isValidateUser)
            } catch (err) {
                console.log(err)
                res.status(400).json(err)
            }
        }
    }
}
