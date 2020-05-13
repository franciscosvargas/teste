
module.exports = app => {
    const Score = app.datasource.models.Score
    const Persistence = require('../../helpers/persistence')(Score)
    const Business = require('../business/scores')(app)

    return {
        create: (req, res) =>
            Business.runningUpdate(req.body)
                .then(object => Persistence.create(object, res))
                .catch(err => console.log(err)),
        update: (req, res) => {
            const query = req.params
            Persistence.update(query, req.body, res)
        },
        listAllDriver: (req, res) => {
            Persistence.listAllQuery({
                where: {
                    driver_id: req.params.driver_id
                },
                include: { all: true },
                limit: 10,
                order: [
                    ['id', 'DESC'],
                    ['created_at', 'DESC']
                ]
            }, res)
        },
        listOne: (req, res) => {
            const query = req.params
            Persistence.listOneWithJoin(query, res)
        },
        listAll: (req, res) => {
            Persistence.listAllWithJoin(res)
        },
        average: (req, res) => {
            const query = {
                attributes: [[Score.sequelize.fn('AVG', Score.sequelize.col('star')), 'star']],
                where: {
                    driver_id: req.params.driver_id
                }
            }
            Persistence.listAllQuery(query, res)
        }
    }
}