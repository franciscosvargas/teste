module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')

    const Model = app.datasource.models.sales;
    const Persistence = require('../../helpers/persistence')(Model)
    const Business = require("../business/sales")(app);

    return {
        find: (req, res) => {
            const query = {
                where: {

                    //     name: {
                    //         $like: `%${req.body.name.toUpperCase()}%`
                    //     }
                },
                limit: 10
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

            Model.findAll(query)
                .then(result => res.status(200).json({ items: result, totalCount: result.length }))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },
        quickSearch: (req, res) => {
            const query = {
                where: {

                    //     name: {
                    //         $like: `%${req.body.name.toUpperCase()}%`
                    //     }
                },
                limit: 10
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

            Model.findAll(query)
                .then(result => res.status(200).json({ items: result, totalCount: result.length }))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },
        update: async (req, res) => {
            try {
                delete req.body._isEditMode
                delete req.body._userId

                const sale = req.body;
                const code = req.body.promocode;

                const promocode = (code ? await Business.findPromocode(code, sale) : null);
                sale.promocode_id = promocode ? promocode.id : null;

                const cashbackRule = await Business.findCashbackRuleForSale(sale);
                sale.cashback_rule_id = cashbackRule ? cashbackRule.id : null;
                sale.cashback_value = cashbackRule ? cashbackRule.percentage / 100 * sale.total : null;

                await Model.update(sale, { where: { id: sale.id } });

                res.status(200).send(sale)

            } catch (err) {
                console.log(err)
                res.status(400).json(err)
            }
        },
        delete: (req, res) => {
            Persistence.delete(req.params, res)
        },
        create: async (req, res) => {
            console.log('req.body: ', req.body);
            delete req.body._isEditMode
            delete req.body._userId

            const sale = req.body;
            const code = req.body.promocode;

            const promocode = (code ? await Business.findPromocode(code, sale) : null);
            sale.promocode_id = promocode ? promocode.id : null;


            const cashbackRule = await Business.findCashbackRuleForSale(sale);
            if (cashbackRule) {
                sale.cashback_rule_id = cashbackRule ? cashbackRule.id : null;
                sale.cashback_value = cashbackRule ? cashbackRule.percentage / 100 * sale.total : null;
            }

            res.status(201).json(await Model.create(sale));
        }
    }
}
