module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')

    const Model = app.datasource.models.variations
    const VariationOption = app.datasource.models.variation_options
    const Persistence = require('../../helpers/persistence')(Model)

    return {
        findAll: (req, res) => {
            const query = {
                where: {shop_id: req.user.object.id},
                include: [{model: VariationOption, as: 'options'}]
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
                where: {shop_id: req.user.object.id},
                limit: 10,
                include: [{model: VariationOption, as: 'options'}]
            }

            try {
                const filters = JSON.parse(req.query.filter)

                if (filters) {
                    query.where.$or = []
                    for (const key in filters) {
                        let tmp = {}
                        tmp[key] = {$like: `%${filters[key]}%`}
                        query.where.$or.push(tmp)
                    }
                }
            } catch (e) {
            }

            Model.findAll(query)
                .then(result => res.status(200).json({items: result, totalCount: result.length}))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },
        update: async (req, res) => {
            const query = {id: req.body.id}
            try {
                const options = req.body.options

                delete req.body._isEditMode
                delete req.body._userId
                delete req.body.id

                if (options) {
                    VariationOption.destroy({where: {variation_id: query.id, id: {$notIn: options.filter(e => e.id).map(e => e.id)}}})
                    for (const option of options) {
                        option.variation_id = query.id

                        if (option.id) {
                            await VariationOption.update(option, {where: {id: option.id}})
                        } else {
                            await VariationOption.create(option)
                        }
                    }
                }

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

            if (req.body.variation_group) {
                req.body.variation_group.shop_id = req.body.shop_id
            }

            Persistence.create(req.body, res, {
                include: [{
                    model: app.datasource.models.variation_groups,
                    as: 'variation_group'
                }, {
                    model: VariationOption,
                    as: 'options'
                }]
            })
        }
    }
}
