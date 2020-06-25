module.exports = app => {
    const Model = app.datasource.models.cashback_rules
    const Category = app.datasource.models.categories
    const Shop = app.datasource.models.shops
    const City = app.datasource.models.cities
    const Persistence = require('../../helpers/persistence')(Model)

    const globalOptions = {
        include: [
            {model: Shop, attributes: ["company_name", "fantasy_name", "id"], through: {attributes: []}},
            {model: Category, attributes: ["name", "id"], through: {attributes: []}},
            {model: City}
        ]
    };

    return {
        create: async (req, res) => {
            const categories = req.body.categories;
            const shops = req.body.shops;

            const CashbackRule = await Model.create(req.body)
            const cashbackRuleId = CashbackRule.id

            if (categories) {
                await CashbackRule.setCategories(categories);
            }

            if (shops) {
                await CashbackRule.setShops(shops);
            }

            res.status(201).json(await Model.findByPk(cashbackRuleId, globalOptions));
        },
        update: async (req, res) => {
            const categories = req.body.categories;
            const shops = req.body.shops;

            const CashbackRule = await Model.findByPk(req.body.id)

            if(!CashbackRule) {
                res.status(404).send();
            }

            if (categories) {
                await CashbackRule.setCategories(categories);
            }

            if (shops) {
                await CashbackRule.setShops(shops);
            }
            Persistence.update({id: req.body.id}, req.body, res)
        },
        listOne: (req, res) => Persistence.listOne(req.params, res, globalOptions),
        listAll: (req, res) => {
            Persistence.listAllQuery({where: req.params}, res, globalOptions)
        },
        delete: (req, res) => Persistence.delete(req.params, res),
        disable: (req, res) => Persistence.update({id: req.params.id}, {status: "Desativado"}, res)
    }
}
