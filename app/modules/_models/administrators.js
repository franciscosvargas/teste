/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('administrators', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    criado_em: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deletado: {
      type: DataTypes.INTEGER(3).UNSIGNED,
      allowNull: false,
      defaultValue: '0'
    },
    login: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    senha: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    imagem_arquivo: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    imagem_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    }
  }, {
    tableName: 'administrators'
  });
};
