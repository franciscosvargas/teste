/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('addresses', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    pais_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    estado_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    cidade_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    bairro: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cep: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    logradouro: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    numero: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    complemento: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'addresses'
  });
};
