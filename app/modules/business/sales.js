module.exports = app => {
    const cashbackStatus = require("../constants/cashBackRuleStatus");
    const promocodeStatus = require("../constants/promocodeStatus");
    const {Op} = require("sequelize");

    const CashbackRule = app.datasource.models.cashback_rules;
    const Promocode = app.datasource.models.promocodes;
    const Category = app.datasource.models.categories;
    const Address = app.datasource.models.addresses;
    const Shop = app.datasource.models.shops;

    return {
        findCashbackRuleForSale: async (sale) => {
            const address = await Address.findByPk(sale.address_id);
            const shop = await Shop.findByPk(sale.shop_id);

            return CashbackRule.findOne({
                where: {
                    status: cashbackStatus.ATIVO,
                    city_id: address.city_id
                },
                include: [
                    {
                        model: Shop,
                        attibutes: [],
                        where: {
                            id: {
                                [Op.or]: [sale.shop_id, null]
                            }
                        }
                    },
                    {
                        model: Category,
                        attibutes: [],
                        where: {
                            id: {
                                [Op.or]: [shop.category_id, null]
                            }
                        }
                    }
                ]
            });
        },
        findPromocode: async (promocode, sale) => {
            const address = await Address.findByPk(sale.address_id);

            return Promocode.findOne({
                where: {
                    code: promocode,
                    status: promocodeStatus.ATIVO,
                    city_id: address.city_id,
                    start_date: {[Op.lte]: Date.now()},
                    expirate_date: {[Op.gte]: Date.now()},
                    min_value_for_sale: {[Op.lte]: sale.total},
                }
            });
        }
    }
}
