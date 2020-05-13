module.exports = app => {
    const Errors = require('../../errors/companyUser/pt-br')
    const Company = app.datasource.models.Company
    const User = app.datasource.models.User
    return {
        create: (req, res, next) => {
            req.assert('permission', Errors.permission).notEmpty()
            req.assert('company_id', Errors.companyId).notEmpty().isInt()
            req.assert('user_id', Errors.userId).notEmpty().isInt()
            const error = req.validationErrors()
            if (error) {
                res.status(400).json(error)
            } else {
                User.findById(req.body.userId)
                    .then(user =>
                        (user)
                            ? Company.findById(req.body.company_id)
                                .then(company => company ? next() : res.status(400).json([Errors.companyNotExist]))
                                .catch(err => res.status(500).json(err))
                            : res.status(400).json(Errors.userNotExist))
                    .catcH(err => res.status(500).json(err))
            }
        },
        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        update: (req, res, next) => {
            req.assert('permission', Errors.permission).optional()
            req.assert('company_id', Errors.companyId).optional().isInt()
            req.assert('user_id', Errors.userId).optional().isInt()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
    }
}
