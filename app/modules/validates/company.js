module.exports = app => {
    const Company = app.datasource.models.Company
    const User = app.datasource.models.User

    const Errors = require('../../errors/company/pt-br')

    const Help = require('../../helpers/searchCnpj')

    const CNPJ = require('cpf_cnpj').CNPJ

    return {
        create: (req, res, next) => {
            req.assert('fantasy', Errors.fantasy).notEmpty()
            req.assert('socialName', Errors.socialName).notEmpty()
            req.assert('multiCompany', Errors.multiCompany).isBoolean()
            req.assert('phone', Errors.phone).notEmpty()
            req.assert('responsible', Errors.responsible).notEmpty()
            req.assert('cnpj', Errors.cnpj).notEmpty()
            req.assert('type_company_id', Errors.typeCompany).notEmpty()
            req.assert('zipCode', Errors.zipCode).notEmpty()
            req.assert('address', Errors.address).notEmpty()
            req.assert('number', Errors.number).notEmpty()
            req.assert('district', Errors.district).notEmpty()
            req.assert('complement', Errors.complement).optional()
            req.assert('state_id', Errors.state).notEmpty()
            req.assert('city_id', Errors.city).notEmpty()
            req.assert('country_id', Errors.countryId).notEmpty()
            req.assert('user_id', Errors.userId).isInt()

            const error = req.validationErrors()
            if (error) {
                // //console.log('estou aqui')
                res.status(400).json(error)
            } else {
                if (!CNPJ.isValid(req.body.cnpj)) {
                    res.status(400).json([Errors.cnpjInvalid])
                } else {
                    User.findById(req.body.user_id)
                        .then(user => !user ? res.status(400).json([Errors.userNotExist]) : next())
                        .catch(err => res.status(500).json(err))
                }
            }
        },
        update: (req, res, next) => {
            isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next()
        },
        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next()
        },
        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.json([Errors.idInvalid]) : next()
        },
        unique: (req, res, next) => {
            const query = {
                where: {$or: [{socialName: {$eq: req.body.socialName}}, {cnpj: {$eq: req.body.cnpj}}]}
            }
            Company.findOne(query)
                .then(company => company ? res.status(400).json([{title: 'Empresa', message: 'Empresa já possui cadastro!'}]) : next())
                .catch(err => res.status(500).json(err))
        },
        isExistCnpj: (req, res, next) => {
            if (!CNPJ.isValid(req.params.cnpj)) {
                res.status(400).json([Errors.cnpjInvalid])
            } else {
                const query = {
                    where: req.params
                }
                Company.findOne(query)
                    .then(company => company ? res.status(400).json({title: 'Empresa', message: 'Empresa já possui cadastro!'}) : res.status(200).json(true))
                    .catch(err => {})
            }
        },
        searchCnpj: (req, res, next) => {
            req.assert('cnpj', Errors.cnpj).notEmpty()
            req.assert('socialName', Errors.socialName).notEmpty()
            const error = req.validationErrors()
            if (!error) {
                if (!CNPJ.isValid(req.body.cnpj)) {
                    res.status(400).json([Errors.cnpjInvalid])
                } else {
                    Help.searchCnpj(req.body, res)
                }
            } else {
                res.status(400).json(error)
            }
        }
    }
}
