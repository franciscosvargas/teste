module.exports = app => {
    const Ranking = app.datasource.models.Ranking

    const Errors = require('../../errors/ranking/pt-br')

    return {
        create: (req, res, next) => {
            req.assert('name', Errors.name).notEmpty()
            req.assert('attendedRace', Errors.attendedRace).notEmpty()
            req.assert('runCanceled', Errors.runCanceled).notEmpty()
            req.assert('interspersedRunTime', Errors.interspersedRunTime).notEmpty()
            req.assert('runningInTheRain', Errors.runningInTheRain).notEmpty()
            req.assert('raceOnSaturday', Errors.raceOnSaturday).notEmpty()
            req.assert('holidayRun', Errors.holidayRun).notEmpty()
            req.assert('raceBetweenDates', Errors.raceBetweenDates).notEmpty()
            req.assert('dateInit', Errors.dateInit).notEmpty()
            req.assert('dateFinish', Errors.dateFinish).notEmpty()
            req.assert('country_id', Errors.countryId).notEmpty()
            req.assert('state_id', Errors.stateId).notEmpty()
            req.assert('service_id', Errors.serviceId).notEmpty()
            const error = req.validationErrors()
            error ? res.status(400).json(error) : next()
        },
        unique: (req, res, next) => {
            const query = {where: {name: req.body.name}}
            Ranking.findOne(query)
                .then(service => service ? res.status(400).json([Errors.serviceExist]) : next())
                .catch(err => res.status(500).json(err))
        },
        update: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        listOne: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        },
        delete: (req, res, next) => {
            isNaN(req.params.id) ? res.status(400).json([Errors.idInvalid]) : next()
        }
    }
}
