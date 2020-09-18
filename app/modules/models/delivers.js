/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    const Delivers = sequelize.define('delivers', {
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
        last_online_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        name: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        email: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        password: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        whatsapp: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING(20),
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('Available', 'Busy', 'Away', 'Offline'),
            allowNull: true
        },
        avatar: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        bag_number: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        address_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        type_vehicle: {
            type: DataTypes.ENUM('Moto', 'Carro', 'Bicicleta'),
            allowNull: true
        },
        vehicle_model: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        vehicle_plate: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        vehicle_color: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        company_document: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        emergency_phone: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        cnh: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        tableName: 'delivers'
    });

    Delivers.associate = (models) => {
        Delivers.hasOne(models.last_locations);
        Delivers.hasMany(models.sales);
        Delivers.belongsTo(models.addresses, { through: "addresses" });
    }

    return Delivers;
}
