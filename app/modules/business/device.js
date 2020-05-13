module.exports = app => {
    const User = app.datasource.models.User
    const RunningDelivery = app.datasource.models.RunningDelivery
    const Onesignal = require('../../helpers/oneSignal')

    return {
        listOne: (req) => {
            const query = {
                where: req.params,
                attributes: {exclude: ['created_at', 'updated_at']},
                include: [{
                    model: User,
                    attributes: {exclude: ['token', 'password', 'master', 'first', 'status', 'block',
                        'created_at', 'updated_at', 'rule_id', 'active', 'forgot']}
                }]
            }
            return query
        },
        listOneRunning: (id) => RunningDelivery.findById(id, {raw: true}),
        pushNotification: token => object => {
            const push = {
                message: {
                    'en': 'Corrida Iniciada'
                },
                running: {
                    running_id: object.id,
                    cancel: false,
                    title: 'Iniciada',
                    message: 'Corrida Iniciada'
                },
                playerId: [token]
            }
            return Onesignal.pushNotification(push)
        }
    }
}
