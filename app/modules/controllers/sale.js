module.exports = app => {
    const moment = require('moment-timezone')
    moment.tz.setDefault('America/Recife')
    const sequelize = require('sequelize')

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

        findByDeliver: (req, res) => {

            const { id } = req.user.object

            const { status } = req.query

            const query = {
                where: {
                   deliver_id: id,
                }
            }

            if(status)
                query.where.status = status

            Model.findAll(query)
                .then(result => res.status(200).json({ items: result, totalCount: result.length }))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },

        findByStatus: (req, res) => {
            const { status } = req.query

            const query = {
                where: {
                   status
                }
            }

            Model.findAll(query)
                .then(result => res.status(200).json({ items: result, totalCount: result.length }))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },

        findByDate: (req, res) => {
            const { date } = req.query

            const query = {
                where: sequelize.where(sequelize.fn('date', sequelize.col('created_at')), '=', date)
            }

            Model.findAll(query)
                .then(result => res.status(200).json({ items: result, totalCount: result.length }))
                .catch(err => {
                    console.log(err)
                    res.status(500).json(err)
                })
        },

        updateStatusAndDeliver: async (req, res) => {

            const { id } = req.params
            const { deliver_id, status } = req.body

            const sale = {}

            if(deliver_id)
                sale.deliver_id = deliver_id

            if(status)
                sale.status = status
            
            try {
                const data = await Model.update(sale, { where: { id } });
                res.json(data.userData)
            } catch (error) {
                console.log(err)
                res.status(400).json(err)
            }
        },

        GetBySalesInStateisAguardandoColeta: (req, res) =>
            Persistence.listAllQuery({
                where: {
                    $and: [
                        { status: 'Aguardando Coleta' }
                    ]
                }
            }, res),

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

            console.log('passou por tudo')

            res.status(201).json(await Model.create(sale));
        }
    }
}
