module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')

    const Model = app.datasource.models.products
    const Complement = app.datasource.models.complements
    const Variation = app.datasource.models.variations
    const VariationOption = app.datasource.models.variation_options
    const Persistence = require('../../helpers/persistence')(Model)

    return {
        find: (req, res) => {
            const query = {
                where: {$and: {shop_id: req.user.object.id}},
                limit: parseInt(req.query.pageSize),
                offset: req.query.pageNumber * req.query.pageSize,
                include: [{model: Variation, include: [{model: VariationOption, as: 'options'}]}, {model: Complement}]
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

            Model.findAndCountAll(query)
                .then(result => res.status(200).json({items: result.rows, totalCount: result.count}))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },
        update: async (req, res) => {
            const query = {id: req.body.id}
            try {
                const complements = req.body.complements
                const variations = req.body.variations

                delete req.body._isEditMode
                delete req.body._userId
                delete req.body.id
                delete req.body.complements
                delete req.body.variations

                if (!req.body.image_url) {
                    delete req.body.image_url
                }

                const Product = await Model.findOne({where: {id: query.id}});

                if (complements) {
                    Product.setComplements(complements.map(comp => comp.id));
                }

                if (variations) {
                    // Variation.destroy({where: {product_id: query.id, id: {$notIn: variations.filter(e => e.id).map(e => e.id)}}})
                    // for (const variation of variations) {
                    //     const options = variation.options
                    //     delete variation.options
                    //
                    //     if (variation.id) {
                    //         Variation.update(variation, {where: {id: variation.id}})
                    //     } else {
                    //         variation.product_id = query.id
                    //         variation.id = ((await Variation.create(variation)).get({plain: true}).id)
                    //     }
                    //
                    //     if (options) {
                    //         VariationOption.destroy({where: {variation_id: variation.id, id: {$notIn: options.filter(e => e.id).map(e => e.id)}}})
                    //         for (const option of options) {
                    //             option.variation_id = variation.id
                    //
                    //             if (option.id) {
                    //                 VariationOption.update(option, {where: {id: option.id}})
                    //             } else {
                    //                 VariationOption.create(option)
                    //             }
                    //         }
                    //     }
                    // }
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
        create: async (req, res) => {
            const complements = req.body.complements
            const variations = req.body.variations

            delete req.body._isEditMode
            delete req.body._userId
            delete req.body.complements
            delete req.body.variations

            req.body.shop_id = req.user.object.id

            const productId = (await Model.create(req.body)).get({plain: true}).id

            if (complements) {
                for (const complement of complements) {
                    complement.product_id = productId
                    Complement.create(complement)
                }
            }

            if (variations) {
                for (const variation of variations) {
                    const options = variation.options
                    delete variation.options

                    variation.product_id = productId
                    variation.id = ((await Variation.create(variation)).get({plain: true}).id)

                    if (options) {
                        VariationOption.destroy({where: {variation_id: variation.id, id: {$notIn: options.filter(e => e.id).map(e => e.id)}}})
                        for (const option of options) {
                            option.variation_id = variation.id

                            if (option.id) {
                                VariationOption.update(option, {where: {id: option.id}})
                            } else {
                                VariationOption.create(option)
                            }
                        }
                    }
                }
            }

            res.status(201).json((await Model.findOne({where: {id: productId}, include: {all: true}})))
        }
    }
}
