module.exports = app => {
    const LastLocation = app.datasource.models.LastLocation
    const Driver = app.datasource.models.Driver
    const User = app.datasource.models.User
    const Vehicles = app.datasource.models.Vehicles
    const RunningTaxiDriver = app.datasource.models.RunningTaxiDriver
    const Business = require('../business/lastLocation')(app)
    const TaxiBusiness = require('../business/taxi')(app)
    const Company = require('../business/company')(app)
    const Help = require('../../helpers/googleMaps')
    return {
        create: (req, res) => {
            req.body.locate = [req.body.lng, req.body.lat]
            Business.detailsDriver(req.body)
                .then(driver => {
                    req.body.service_id = driver.service_id
                    LastLocation.create(req.body)
                        .then(lastLocation => res.status(200).json(lastLocation))
                        .catch(err => res.status(500).json(err))
                })
                .catch(err => res.status(500).json(err))
        },

        update: eventEmitter => (req, res) => {
            try {
                RunningTaxiDriver.find({where: {$and: [{driver_id: req.params.driver_id}, {status: [2, 3, 4, 5]}]}}).then(res => {
                    if (res) {
                        eventEmitter.emit('provider-position', {
                            driver_id: req.params.driver_id,
                            user_id: res.dataValues.user_id,
                            position: {lng: req.body.lng, lat: req.body.lat}
                        })
                    }
                })
            } catch (e) {
                console.log('error', e)
            }
            LastLocation.update({
                locate: {
                    type: 'Point',
                    coordinates: [req.body.lng, req.body.lat]
                },
                active: true,
                status: true,
                accept: false,
                ocuped: false
            }, {where: {driver_id: req.params.driver_id}})
                .then(lastLocation => res.status(200).json(lastLocation))
                .catch(err => res.status(500).json(err))
        },
        listOne: (req, res) => {
            const query = {driver_id: req.params.driver_id}
            LastLocation.findOne(query)
                .then(lastLocation => res.status(200).json(lastLocation))
                .catch(err => res.status(500).json(err))
        },
        listAll: (req, res) => {
            const query = {}
            LastLocation.find(query)
                .then(lastLocation => res.status(200).json(lastLocation))
                .catch(err => res.status(500).json(err))
        },
        closer: async (req, res) => {
            // let insert = {
            //     driver_id: 1,
            //     locate: { type: 'Point', coordinates: [req.body.lng, req.body.lat] },
            //     active: true,
            //     status: true,
            //     cardMarchine: true,
            //     cardDiscount: 0,
            //     moneyDiscount: 0,
            //     service_id: 1,
            //     block: false,
            //     accept: false,
            //     ocuped: false,
            //     vehicle_id: 1,
            //     acceptOnlyCard: false
            // }
            // LastLocation.create(insert).then(lastLocation => res.status(200).json(lastLocation))
            //     .catch(err => {
            //         console.log(insert)
            //         console.log(err)
            //         res.status(500).json(err)
            //     })

            // const location = [req.body.lng, req.body.lat]
            // const search = {
            //     locate: {
            //         $near: {
            //             $geometry: {
            //                 type: 'Point',
            //                 coordinates: location
            //             },
            //             $maxDistance: (req.body.distance)
            //         }
            //     }
            // }
            const last = await LastLocation.findAll({
                where: {
                    $and: [
                        // search,
                        {status: true},
                        {active: true},
                        {ocuped: false},
                        {accept: false}
                    ]
                }
            })

            const driverIid = await last.map(value => value.driver_id)
            const driverList = await Driver.findAll({
                where: {
                    id: {$in: driverIid}
                },
                order: [
                    ['id', 'ASC']
                ],
                include: [
                    {
                        model: User
                        // attributes: ['name', 'avatar']
                    },
                    {
                        model: Vehicles
                    }
                ]
            })

            const array = []
            let remaining = 0

            last.map((value, index) => {
                if (driverList[index]) {
                    if (driverList[index].dataValues.id === value.driver_id) {
                        remaining++

                        TaxiBusiness.validateRates(req.body)
                            .then(TaxiBusiness.calculateTaximeter)
                            .catch((e) => {
                                console.log(e)
                            })
                            .then(Help.calculatePointAddressTaxi)
                            .catch((e) => {
                                console.log(e)
                            })
                            .then(TaxiBusiness.listOnePromoCode(req))
                            .catch((e) => {
                                console.log(e)
                            })
                            .then(TaxiBusiness.isValidateCupomTaxi(req))
                            .catch((e) => {
                                console.log(e)
                            })
                            .then(TaxiBusiness.isValidateUse(req))
                            .catch((e) => {
                                console.log(e)
                            })
                            .then(calculate => {
                                remaining--

                                array.push({
                                    location: value,
                                    driver: driverList[index],
                                    calculate
                                })

                                if (remaining <= 0) {
                                    res.status(200).json(array)
                                }
                            })
                            .catch((e) => {
                                console.log(e)
                            })
                    }
                }
            })
        }
    }
}
