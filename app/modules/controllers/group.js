module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')

    const Model = app.datasource.models.groups
    const Persistence = require('../../helpers/persistence')(Model)

    return {
        findAll: (req, res) => {
            const query = {
                where: { shop_id: req.user.object.id }
            }

            Model.findAll(query)
                .then(result => res.status(200).json(result))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },

        findAllByShopId: (req, res) => {
            const query = {
                where: { shop_id: req.params.id },
                attributes: { exclude: ['created_at', 'updated_at', 'deleted_at', 'shop_id'] }
            }

            Model.findAll(query)
                .then(result => res.status(200).json(result))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },

        find: (req, res) => {
            const query = {
                where: { $and: { shop_id: req.user.object.id } },
                limit: parseInt(req.query.pageSize),
                offset: req.query.pageNumber * req.query.pageSize
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
            } catch (e) {
            }

            Model.findAndCountAll(query)
                .then(result => res.status(200).json({ items: result.rows, totalCount: result.count }))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },
        update: async (req, res) => {
            const query = { id: req.body.id }
            try {
                delete req.body._isEditMode
                delete req.body._userId
                delete req.body.id

                Persistence.update(query, req.body, res)
            } catch (err) {
                console.log(err)
                res.status(400).json(err)
            }
        },
        delete: (req, res) => {
            Persistence.delete(req.params, res)
        },
        create: (req, res) => {
            delete req.body._isEditMode
            delete req.body._userId

            req.body.shop_id = req.user.object.id

            Persistence.create(req.body, res)
        }
    }
}
