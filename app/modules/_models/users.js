/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
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
    login: {
      type: DataTypes.STRING(300),
      allowNull: true,
      unique: true
    },
    senha: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    token_recuperacao_senha: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    telefone: {
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
    sexo: {
      type: DataTypes.ENUM('Masculino','Feminino','Inter-sexual','Transgênero Homem','Transgênero Mulher','Bissexual Homem','Bissexual Mulher','Gay','Lésbica','Assexual'),
      allowNull: true
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    configuracao_visibilidade: {
      type: DataTypes.ENUM('Vísivel','Invisível'),
      allowNull: true
    },
    plano_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    nivel_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    plano_expira_em: {
      type: DataTypes.DATE,
      allowNull: true
    },
    email_paypal: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    imagem_arquivo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    imagem_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    emprego: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    escolaridade: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    rg: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    passaporte: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    deficiente: {
      type: DataTypes.ENUM('Sim','Não'),
      allowNull: true
    },
    menu_imagem_arquivo: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    menu_imagem_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    pontuacao: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    }
  }, {
    tableName: 'users'
  });
};
