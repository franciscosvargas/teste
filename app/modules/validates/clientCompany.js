module.exports = app => {
    const Company = app.datasource.models.Company
    const Errors = require('../../errors/clientCompany/pt-br')
    return {
        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            req.assert('phone', Errors.phone).notEmpty()
            req.assert('company_id', Errors.company).notEmpty()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                Company.findById(req.body.company_id)
                    .then(company => company ? next() : res.status(400).json([Errors.companyNotExist]))
                    .catch(err => res.status(500).json(err))
            }
        },
        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        update: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),

        searchPhone: (req, res, next) => isNaN(req.params.phone) ? res.status(400).json([Errors.phoneInvalid]) : next()
    }
}
