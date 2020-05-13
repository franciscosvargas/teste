/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('sales', {
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
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        },
        total: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        shop_amount: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        deliver_fee: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        paid: {
            type: DataTypes.INTEGER(1).UNSIGNED,
            allowNull: false,
            defaultValue: '0'
        },
        cancelled: {
            type: DataTypes.INTEGER(1).UNSIGNED,
            allowNull: false,
            defaultValue: '0'
        },
        deliveried: {
            type: DataTypes.INTEGER(1).UNSIGNED,
            allowNull: false,
            defaultValue: '0'
        },
        status: {
            type: DataTypes.ENUM('Waiting Acceptance', 'Waiting Deliver', 'Cancelled', 'Delivered', 'Being Produced', 'In Delivering'),
            allowNull: true
        },
        observations: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        address_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        },
        payment_type_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: true
        },
        finished: {
            type: DataTypes.INTEGER(1).UNSIGNED,
            allowNull: false,
            defaultValue: '0'
        },
        delivery_tax: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        type_delivery: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        troco: {
            type: DataTypes.DECIMAL,
            allowNull: true
        },
        delivery_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        fatura_id: {
            type: DataTypes.INTEGER(11),
            allowNull: true
        }
    }, {
        tableName: 'sales'
    })
}
