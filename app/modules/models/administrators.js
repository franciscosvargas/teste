/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('administrators', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
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
    login: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    image_file: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    access: {
      type: DataTypes.ENUM('All','Deliveres','Sales'),
      allowNull: true,
      defaultValue: 'All'
    }
  }, {
    tableName: 'administrators'
  });
};
