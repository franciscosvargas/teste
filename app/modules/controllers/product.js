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
                include: [
                    {model: Variation, include: [{model: VariationOption, as: 'options'}]},
                    {model: Complement}
                ]
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
                    await Product.setComplements(complements.map(comp => comp.id));
                }

                if (variations) {
                    await Product.setVariations(variations.map(variation => variation.id));
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

            const Product = await Model.create(req.body)
            const productId = Product.id

            if (complements) {
                await Product.setComplements(complements.map(comp => comp.id));
            }

            if (variations) {
                await Product.setVariations(variations.map(variation => variation.id));
            }

            res.status(201).json((await Model.findOne({
                where: {id: productId},
                include: [
                    {model: Variation, include: [{model: VariationOption, as: 'options'}]},
                    {model: Complement}
                ]
            })))
        }
    }
}
