module.exports = app => {
    const Model = app.datasource.models.variation_groups
    const Variation = app.datasource.models.variations
    const VariationOption = app.datasource.models.variation_options
    const Persistence = require('../../helpers/persistence')(Model)

    return {
        findAll: (req, res) => {
            const query = {
                where: {shop_id: req.user.object.id},
                include: [{model: Variation, as: 'variations', include: [{model: VariationOption, as: 'options'}]}]
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
                include: [{model: Variation, as: 'variations', include: [{model: VariationOption, as: 'options'}]}]
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
                delete req.body._isEditMode
                delete req.body._userId
                delete req.body.id

                const variations = req.body.variations

                const VariationGroup = await Model.findOne({where: {id: query.id}});

                if (variations) {
                    await VariationGroup.setVariations(variations.map(variation => variation.id));
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
            const variations = req.body.variations

            delete req.body._isEditMode
            delete req.body._userId

            req.body.shop_id = req.user.object.id

            if (variations) {
                variations.forEach(variation => {
                    variation.shop_id = req.body.shop_id
                })
            }

            Persistence.create(req.body, res, {
                include: [{
                    model: Variation,
                    as: 'variations',
                    include: {
                        model: VariationOption,
                        as: 'options'
                    }
                }]
            })
        }
    }
}
