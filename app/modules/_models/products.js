/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
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
      allowNull: true,
      defaultValue: '0'
    },
    loja_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    valor: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    valor_promocao: {
      type: DataTypes.DECIMAL,
      allowNull: true
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
    tableName: 'products'
  });
};
