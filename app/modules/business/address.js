module.exports = app => {
    const GoogleMaps = require('../../helpers/googleMaps')
    const ReturnObject = require('../../helpers/returnObject')
    const City = app.datasource.models.City
    const Country = app.datasource.models.Country
    const State = app.datasource.models.State
    const Address = app.datasource.models.Address
    const User = app.datasource.models.User

    const verifyObject = (object, resolve, reject) => object ? resolve(object) : reject({
        title: 'Error',
        message: 'Endereço não existe!'
    })

    return {
        create: (object) => {
            let query = {}
            if (object.searchId === true || object.searchId == 'true') {
                query = {
                    where: {
                        id: object.city_id
                    },
                    include: [
                        {
                            model: Country,
                            where: {
                                id: object.country_id
                            }
                        },
                        {
                            model: State,
                            where: {
                                id: object.state_id
                            }
                        }
                    ]
                }
            } else {
                query = {
                    where: {
                        name: {
                            $like: object.city_id
                        }
                    },
                    include: [
                        {
                            model: Country,
                            where: {
                                name: {
                                    $like: object.country_id
                                }
                            }
                        },
                        {
                            model: State,
                            where: {
                                initials: {
                                    $like: object.state_id
                                }
                            }
                        }
                    ]
                }
            }

            return new Promise((resolve, reject) => {
                City.findOne(query)
                    .then(city => {
                        try {
                            object.city = city.dataValues.name
                            object.state = city.dataValues.State.dataValues.name
                            object.country = city.dataValues.Country.dataValues.name
                            object.city_id = city.dataValues.id
                            object.state_id = city.dataValues.State.dataValues.id
                            object.country_id = city.dataValues.Country.dataValues.id
                            GoogleMaps.getAddressLatLng(object)
                                .then(result => resolve(ReturnObject.returnGoogleAddressTratment(object, result)))
                                .catch(reject)
                        } catch (err) {
                            reject({
                                title: 'Error',
                                message: 'Não existe serviço do IUVO Club em sua cidade'
                            })
                        }
                    })
                    .catch(reject)
            })
        },
        userAddress: (id) => {
            const query = {
                where: {
                    user_id: id
                },
                include: [{
                    model: User
                }]
            }
            return new Promise((resolve, reject) => {
                Address.findOne(query)
                    .then(address => verifyObject(address, resolve, reject))
                    .catch(reject)
            })
        },
        stageUser: body => new Promise((resolve, reject) =>
            User.update({stage: 6}, {where: {id: body.user_id}})
                .then(() => resolve(body))
                .catch(reject))
    }
}
