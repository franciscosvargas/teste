/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('settings', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deletado: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    nome: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    valor: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'settings'
  });
};
