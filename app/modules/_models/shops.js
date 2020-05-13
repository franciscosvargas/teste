/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shops', {
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
    nome_fantasia: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    razao_social: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    cnpj: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    imagem_arquivo: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    imagem_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    ie: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    login: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    senha: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    responsavel_nome: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    responsavel_email: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    responsavel_telefone: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    responsavel_whatsapp: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    ativo: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: false,
      defaultValue: '1'
    },
    tipo_entrega: {
      type: DataTypes.ENUM('PedeAe Delivery','Propria'),
      allowNull: true
    },
    taxa_venda: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    forma_pagamento: {
      type: DataTypes.ENUM('Mensal','Semestral','Anual com desconto'),
      allowNull: true
    },
    conta_banco: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    conta_agencia: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    conta_numero: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    conta_titular: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    conta_cpf: {
      type: DataTypes.STRING(30),
      allowNull: true
    }
  }, {
    tableName: 'shops'
  });
};
