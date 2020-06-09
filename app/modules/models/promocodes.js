/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let Promocode = sequelize.define('promocodes', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: true
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expirate_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    amount_per_user: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    amount_per_sale: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    min_value: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    max_value: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    min_value_for_sale: {
      type: DataTypes.DECIMAL,
      allowNull: true
    },
    type_payment: {
      type: DataTypes.ENUM("Online", "Offline", "Todas"),
      allowNull: true
    },
    total_budget: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    used_budget: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    company_value: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    partner_value: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    partner: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    client_rules_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    partner_rules_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    pause_at_limit: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    free_delivery: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    fixed_price: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    budget_responsibility: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    campaign_type: {
      type: DataTypes.ENUM("Loja"),
      allowNull: true,
    },
    promo_type: {
      type: DataTypes.ENUM("Desconto percentual", "Promocombo", "Entrega"),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("Ativo", "Desativado", "Pausa"),
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'promocodes'
  });

  Promocode.associate = (models) => {
    Promocode.belongsTo(models.cities);
  }

  return Promocode;
};
