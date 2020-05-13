/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('banks', {
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
    code: {
      type: DataTypes.INTEGER(3).UNSIGNED.ZEROFILL,
      allowNull: true
    },
    bank: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'banks'
  });
};
