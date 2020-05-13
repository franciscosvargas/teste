/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cities', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idEstado: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    nome: {
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
    tableName: 'cities'
  });
};
