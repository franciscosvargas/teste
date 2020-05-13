/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('states', {
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
    country_id: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(35),
      allowNull: false
    },
    uf: {
      type: DataTypes.CHAR(2),
      allowNull: false
    },
    iso: {
      type: DataTypes.INTEGER(2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: '1'
    }
  }, {
    tableName: 'states'
  });
};
