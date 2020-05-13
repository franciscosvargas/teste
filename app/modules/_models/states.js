/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('states', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idPais: {
      type: DataTypes.INTEGER(4),
      allowNull: false
    },
    nome: {
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
    tableName: 'states'
  });
};
