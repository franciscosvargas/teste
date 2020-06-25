/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  let CashbackRule = sequelize.define('cashback_rules', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    percentage: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Ativo", "Desativado"),
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
    tableName: 'cashback_rules'
  });

  CashbackRule.associate = (models) => {
    CashbackRule.hasMany(models.sales);
    CashbackRule.belongsToMany(models.shops, {through: "re_cashback_rule_shop"});
    CashbackRule.belongsToMany(models.categories, {through: "re_cashback_rule_category"});
    CashbackRule.belongsTo(models.cities);
  }

  return CashbackRule;
};
