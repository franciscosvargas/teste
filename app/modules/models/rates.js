/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const Rates = sequelize.define('rates', {
        id: {
            type: DataTypes.INTEGER(11),
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
        rating: {
            type: DataTypes.INTEGER(1).UNSIGNED.ZEROFILL,
            allowNull: false
        },
        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        },
        sale_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'rates'
    })

    return Rates;
}
