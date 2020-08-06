const { and } = require('sequelize')

module.exports = app => {
    const Addresses = app.datasource.models.addresses
    const moment = require('moment-timezone')
    const crypto = require('../../helpers/crypto')
    moment.tz.setDefault('America/Recife')

    const Model = app.datasource.models.shops
    const OpeningHour = app.datasource.models.opening_hours
    const Persistence = require('../../helpers/persistence')(Model)

    return {
        find: (req, res) => {
            const query = {
                where: {

                    //     name: {
                    //         $like: `%${req.body.name.toUpperCase()}%`
                    //     }
                },
                include: {
                    model: OpeningHour
                },
                attributes: { exclude: ['password'] },
                limit: 10,
                offset: req.query.pageNumber * 10
            }

            try {
                const filters = JSON.parse(req.query.filter)

                if (filters) {
                    query.where.$or = []
                    for (const key in filters) {
                        let tmp = {}
                        tmp[key] = { $like: `%${filters[key]}%` }
                        query.where.$or.push(tmp)
                    }
                }
            } catch (e) { }

            Model.findAndCountAll(query)
                .then(result => res.status(200).json({ items: result.rows, totalCount: result.count }))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },
        update: async (req, res) => {
            let query;
            if (req.body.password === null) {
                query = {
                    id: req.body.id
                }

            } else {
                query = {
                    id: req.body.id,
                }
            }

            try {
                delete req.body._isEditMode
                delete req.body._userId

                const shop = req.body;
                const shopId = shop.id;
                const openingHours = shop.opening_hour;
                if (shop.password) shop.password = crypto.md5(String(shop.password));

                if (openingHours) {
                    openingHours.shop_id = shopId;
                    await OpeningHour.upsert(openingHours, { where: { shop_id: shopId } })
                }

                Persistence.update(query, shop, res)
            } catch (err) {
                console.log(err)
                res.status(400).json(err)
            }
        },
        listByCategoryId: (req, res) =>
            Persistence.listAllQuery({
                include: {
                    model: Addresses
                },
                where: {
                    $and: [
                        { category_id: parseInt(req.params.id) }
                    ]
                }
            }, res),

        listByCategoryIdWhereCityName: (req, res) =>
            Persistence.listAllQuery({

                include: {
                    model: Addresses,
                    where: { city: req.params.city }

                },
                where: {
                    $and: [
                        { category_id: +req.params.id }
                    ]
                },

            }, res),

        GetByShopId: (req, res) =>
            Persistence.listAllQuery({
                where: {
                    $and: [
                        { id: parseInt(req.params.id) },
                    ]
                }
            }, res),

        getIdByAddressId: (req, res) =>
            Persistence.listAllQuery({
                where: {
                    id: parseInt(req.params.id)
                },
                attributes: ['address_id']
            }, res),

        delete: (req, res) => {
            Persistence.delete(req.params, res)
        },
        create: (req, res) => {
            delete req.body._isEditMode
            delete req.body._userId

            const shop = req.body;
            shop.password = crypto.md5(String(shop.password));

            Persistence.create(shop, res, {
                include: {
                    model: OpeningHour
                }
            })
        },
        online: (req, res) => Persistence.update({ id: req.params.id }, { online: true }, res),
        offline: (req, res) => Persistence.update({ id: req.params.id }, { online: false }, res)
    }
}
