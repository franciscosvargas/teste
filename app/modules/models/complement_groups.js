/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const ComplementGroup = sequelize.define('complement_groups', {
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
        shop_id: {
            type: DataTypes.INTEGER(11),
            allowNull: false
        }
    }, {
        tableName: 'complement_groups'
    });

    ComplementGroup.associate = (models) => {
        ComplementGroup.hasMany(models.complements, { as: 'complements' });
    }

    return ComplementGroup;
}
