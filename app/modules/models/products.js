/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const Products = sequelize.define('products', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
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
        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        group_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        promotional_price: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        image_file: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        available_time_start: {
            type: DataTypes.TIME,
            allowNull: true
        },
        available_time_end: {
            type: DataTypes.TIME,
            allowNull: true
        }
    }, {
        tableName: 'products'
    })

    Products.associate = (models) => {
        Products.belongsToMany(models.complements, {through: 're_product_complements'})
        Products.belongsToMany(models.variations, {through: 're_product_variations'})
    }

    return Products
}
