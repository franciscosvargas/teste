
module.exports = app => {
    const Ranking = app.datasource.models.Ranking
    const Driver = app.datasource.models.Driver
    const User = app.datasource.models.User
    const RankingInDriver = app.datasource.models.RankingInDriver
    const Persistence = require('../../helpers/persistence')(Ranking)
    const PersistenceDriver = require('../../helpers/persistence')(RankingInDriver)

    return {
        create: (req, res) => Persistence.create(req.body, res),
        update: (req, res) => Persistence.update(req.params, req.body, res),
        listOne: (req, res) => Persistence.listOneWithJoin(req.params, res),
        listAll: (req, res) => Persistence.listAllWithJoin(res),
        listAllRanking: async (req, res) => {
            PersistenceDriver.listAllQuery({
                where: {ranking_id: parseFloat(req.params.ranking_id)},
                group: ['RankingInDriver.driver_id'],
                attributes: [[RankingInDriver.sequelize.fn('SUM', RankingInDriver.sequelize.col('points')), 'pointAll']],
                include: [
                    {
                        model: Driver,
                        attributes: ['id'],
                        required: true,
                        include: [
                            {
                                model: User,
                                attributes: ['avatar', 'name', 'email']
                            }
                        ]
                    }
                ],
                limit: 50,
                order: RankingInDriver.sequelize.literal('pointAll DESC')
            }, res)
        },
        delete: (req, res) => Persistence.delete(req.params, res)
    }
}
