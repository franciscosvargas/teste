module.exports = app => {
    const BlockDriver = app.datasource.models.BlockDriver
    const Errors = require('../../errors/blockDriver/pt-br')

    return {
        create: (req, res, next) => {
            req.assert('description', Errors.description).notEmpty()
            req.assert('company_id', Errors.companyId).notEmpty()
            req.assert('driver_id', Errors.driverId).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        unique: (req, res, next) => {
            const query = {
                where: {
                    $and: [
                        {driver_id: req.body.driver_id},
                        {company_id: req.body.company_id}
                    ]
                }
            }
            BlockDriver.findOne(query)
                .then(block => block ? res.status(400).json([Errors.blockDriver]) : next())
                .catch(err => res.status(500).json(err))
        },
        update: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        listOne: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next(),
        delete: (req, res, next) => isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
    }
}

///