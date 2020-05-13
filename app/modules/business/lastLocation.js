module.exports = app => {
    const Driver = app.datasource.models.Driver
    const User = app.datasource.models.User
    const LastLocation = app.datasource.models.LastLocation
    const Address = app.datasource.models.Address
    return {
        detailsDriver: (object) => {
            const query = {
                where: {
                    id: object.driver_id
                },
                include: [
                    {
                        model: User, exclude: ['password', 'created_at', 'updated_at', 'master', 'token', 'forgot', 'active', 'token']
                    }
                ],
                raw: true
            }
            return Driver.findOne(query)
        },
        driverOne: id => {
            const query = {
                where: {
                    id: id
                },
                raw: true
            }
            return Driver.findOne(query)
        },
        driverOnline: req => {
            const query = {
                where: {
                    $and: [
                        {status: true},
                        {active: true},
                        {ocuped: false}
                    ]
                },
                include: [{
                    model: User,
                    required: true,
                    attributes: ['name'],
                    include: [{model: Address, where: req.params, required: true}]
                }],
                attributes: ['id']
            }
            return Driver.findAll(query)
        },
        listDriver: object => Object.assign({query: object.map(driver => ({driver_id: driver.id})), mysql: object}, {}),
        isOnline: object => new Promise(async (resolve, reject) => {
            try {
                object.query = await Promise.all(object.query.map(value => LastLocation.findOne(value)))
                resolve(object)
            } catch (err) {
                reject(err)
            }
        })
    }
}
