/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let Shop = sequelize.define('shops', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: true,
            primaryKey: true,
            autoIncrement: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        fantasy_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        company_name: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        cnpj: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        image_file: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        ie: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        login: {
            type: DataTypes.STRING(80),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        owner_name: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        owner_email: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        owner_phone: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        owner_whatsapp: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        active: {
            type: DataTypes.INTEGER(1).UNSIGNED,
            allowNull: true,
            defaultValue: '1'
        },
        online: {
            type: DataTypes.INTEGER(1).UNSIGNED,
            allowNull: true,
            defaultValue: '1'
        },
        deliver_type: {
            type: DataTypes.ENUM('PedeAe Delivery', 'Propria'),
            allowNull: true
        },
        sell_tax: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        payment_type: {
            type: DataTypes.ENUM('Mensal', 'Semestral', 'Anual com desconto'),
            allowNull: true
        },
        bank_account: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        bank_agency: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        bank_number: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        bank_owner: {
            type: DataTypes.STRING(250),
            allowNull: true
        },
        bank_document: {
            type: DataTypes.STRING(30),
            allowNull: true
        },
        plan_price: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        address_id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: true
        },
        total_sales: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        total_fee: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        token: {
            type: DataTypes.STRING(300),
            allowNull: true
        },
        category_id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: true
        }
    }, {
        tableName: 'shops'
    });

    Shop.associate = (models) => {
        Shop.hasOne(models.opening_hours);
        Shop.belongsToMany(models.cashback_rules, { through: "re_cashback_rule_shop" });
        Shop.belongsTo(models.addresses, { through: "addresses" });
        Shop.belongsTo(models.categories, { through: "categories" });
    }

    return Shop;
}
