/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    let OpeningHour = sequelize.define('opening_hours', {
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
        sunday_opens: {
            type: DataTypes.TIME,
            allowNull: true
        },
        sunday_closes: {
            type: DataTypes.TIME,
            allowNull: true
        },
        monday_opens: {
            type: DataTypes.TIME,
            allowNull: true
        },
        monday_closes: {
            type: DataTypes.TIME,
            allowNull: true
        },
        tuesday_opens: {
            type: DataTypes.TIME,
            allowNull: true
        },
        tuesday_closes: {
            type: DataTypes.TIME,
            allowNull: true
        },
        wednesday_opens: {
            type: DataTypes.TIME,
            allowNull: true
        },
        wednesday_closes: {
            type: DataTypes.TIME,
            allowNull: true
        },
        thursday_opens: {
            type: DataTypes.TIME,
            allowNull: true
        },
        thursday_closes: {
            type: DataTypes.TIME,
            allowNull: true
        },
        friday_opens: {
            type: DataTypes.TIME,
            allowNull: true
        },
        friday_closes: {
            type: DataTypes.TIME,
            allowNull: true
        },
        saturday_opens: {
            type: DataTypes.TIME,
            allowNull: true
        },
        saturday_closes: {
            type: DataTypes.TIME,
            allowNull: true
        },
        shop_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'opening_hours'
    });

    OpeningHour.associate = (models) => {
        OpeningHour.belongsTo(models.shops);
    }

    return OpeningHour;
}
