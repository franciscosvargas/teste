module.exports = app => {
    const User = app.datasource.models.User
    const Rule = app.datasource.models.Rule
    const Address = app.datasource.models.Address
    return {
        listOne: (req) => {
            const query = {
                where: req.params,
                attributes: {
                    exclude: ['created_at', 'updated_at']
                },
                include: [{
                    model: User,
                    attributes: {
                        exclude: ['password', 'created_at', 'updated_at', 'master', 'token', 'forgot', 'active']
                    },
                    include: [{model: Rule, where: {status: true}, attributes: {exclude: ['created_at', 'updated_at', 'status']}}]
                },
                {
                    model: Address,
                    attributes: {exclude: ['created_at', 'updated_at']}
                }]
            }
            return query
        },
        listAll: () => {
            const query = {
                where: {},
                attributes: {
                    exclude: ['created_at', 'updated_at']
                },
                include: [{
                    model: User,
                    attributes: {
                        exclude: ['password', 'created_at', 'updated_at', 'master', 'token', 'forgot', 'active']
                    },
                    include: [{model: Rule, where: {status: true}, attributes: {exclude: ['created_at', 'updated_at', 'status']}}]
                },
                {
                    model: Address,
                    attributes: {exclude: ['created_at', 'updated_at']}
                }]
            }
            return query
        }
    }
}
