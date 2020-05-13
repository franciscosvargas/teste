/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('deliver_locations', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deliver_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    locate: {
      type: "POINT",
      allowNull: true
    },
    active: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    cardMarchine: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    cardDiscount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    moneyDiscount: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    service_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    block: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    accept: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    block_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lat_timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ocuped: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    },
    acceptOnlyCard: {
      type: DataTypes.INTEGER(1),
      allowNull: true
    }
  }, {
    tableName: 'deliver_locations'
  });
};
