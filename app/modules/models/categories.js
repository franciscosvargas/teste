/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let Category = sequelize.define('categories', {
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
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        hidden: {
            type: DataTypes.INTEGER(1),
            allowNull: true,
            defaultValue: '0'
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'categories'
    });

    Category.associate = (models) => {
        Category.belongsToMany(models.cashback_rules, {through: "re_cashback_rule_category"});
    }

    return Category;
}
