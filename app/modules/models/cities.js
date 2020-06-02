/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let City = sequelize.define('cities', {
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
    state_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    iso: {
      type: DataTypes.INTEGER(8),
      allowNull: false
    },
    iso_ddd: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: '1'
    }
  }, {
    tableName: 'cities'
  });

  City.associate = (models) => {
    City.hasMany(models.promocodes);
    City.hasMany(models.cashback_rules);
  }

  return City;
};
