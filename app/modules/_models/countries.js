/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('countries', {
    id: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      primaryKey: true
    },
    iso_code: {
      type: DataTypes.CHAR(2),
      allowNull: false
    },
    iso_num: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    data_criacao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    data_update: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: '1'
    }
  }, {
    tableName: 'countries'
  });
};
