module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')

    const Model = app.datasource.models.products
    const Complement = app.datasource.models.complements
    const ComplementGroup = app.datasource.models.complement_groups
    const Variation = app.datasource.models.variations
    const VariationOption = app.datasource.models.variation_options
    const VariationGroup = app.datasource.models.variation_groups
    const Persistence = require('../../helpers/persistence')(Model)
    const ComplementPersistence = require('../../helpers/persistence')(Complement)
    const VariationPersistence = require('../../helpers/persistence')(Variation)
    const VariationOptionPersistence = require('../../helpers/persistence')(VariationOption)
    const VariationGroupPersistence = require('../../helpers/persistence')(VariationGroup)
    const ComplementGroupPersistence = require('../../helpers/persistence')(ComplementGroup)

    async function upsertComplements(complements, shopId) {
        return await Promise.all(
            complements.map(async comp => {
                const complementGroup = comp.complement_group;
                comp.shop_id = shopId;

                if (complementGroup) {
                    complementGroup.shop_id = shopId;
                    comp.variation_group_id = (await ComplementGroupPersistence.upsert(complementGroup)).id;
                }
                return (await ComplementPersistence.upsert(comp)).id;
            })
        );
    }

    async function upsertOrDeleteVariationsOptions(variationModel, options) {
        await VariationOption.destroy({
            where: {
                variation_id: variationModel.id,
                id: {$notIn: options.filter(e => e.id).map(e => e.id)}
            }
        });

        return await Promise.all(options.map(async option => {
            option.variation_id = variationModel.id;
            return (await VariationOptionPersistence.upsert(option)).id;
        }));
    }

    async function upsertVariations(variations, shopId) {
        const variationsIds = await Promise.all(
            variations.map(async variation => {
                const variationGroup = variation.variation_group;
                const options = variation.options;

                variation.shop_id = shopId;

                if (variationGroup) {
                    variationGroup.shop_id = shopId;
                    variation.variation_group_id = (await VariationGroupPersistence.upsert(variationGroup)).id;
                }

                const variationModel = await VariationPersistence.upsert(variation);

                if (options) {
                    const optionsIds = await upsertOrDeleteVariationsOptions(variationModel, options);
                    await variationModel.setOptions(optionsIds);
                }

                return variationModel.id;
            })
        );
        return variationsIds;
    }

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
                const shopId = req.user.object.id;

                delete req.body._isEditMode
                delete req.body._userId
                delete req.body.id
                delete req.body.complements
                delete req.body.variations

                if (!req.body.image_url) {
                    delete req.body.image_url
                }

                const Product = await Model.findByPk(query.id);
                const productId = Product.id;

                if (complements) {
                    const complementsIds = await upsertComplements(complements, shopId);
                    await Product.setComplements(complementsIds);
                }

                if (variations) {
                    const variationsIds = await upsertVariations(variations, shopId);
                    await Product.setVariations(variationsIds);
                }

                await Model.update(req.body, {where: query});

                res.status(200).json(await Model.findByPk(productId, {
                    include: [
                        {model: Variation, include: [{model: VariationOption, as: 'options'}]},
                        {model: Complement}
                    ]
                }))
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

            const shopId = req.user.object.id;
            req.body.shop_id = shopId;

            const Product = await Model.create(req.body)
            const productId = Product.id

            if (complements) {
                const complementsIds = await upsertComplements(complements, shopId);
                await Product.setComplements(complementsIds);
            }

            if (variations) {
                const variationsIds = await upsertVariations(variations, shopId);
                await Product.setVariations(variationsIds);
            }

            res.status(201).json(await Model.findByPk(productId, {
                include: [
                    {model: Variation, include: [{model: VariationOption, as: 'options'}]},
                    {model: Complement}
                ]
            }));
        }
    }
}
