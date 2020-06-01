/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const LastLocation = sequelize.define('last_locations', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        latitude: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        longitude: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        deliver_id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'last_locations'
    });

    LastLocation.associate = (models) => {
        LastLocation.belongsTo(models.delivers);
    }

    return LastLocation;
}
