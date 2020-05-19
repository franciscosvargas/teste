/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
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
      allowNull: true,
      unique: true
    },
    password: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    password_recover_token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    whatsapp: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    cpf: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    facebook_oauth_uid: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    google_oauth_uid: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    image_file: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    }
  }, {
    tableName: 'users'
  });
};
