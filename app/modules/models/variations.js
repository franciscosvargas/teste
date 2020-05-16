/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const Variations = sequelize.define('variations', {
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
    shop_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    required: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      allowNull: true
    },
    max_options: {
      type: DataTypes.INTEGER(8).UNSIGNED,
      allowNull: true
    }
  }, {
    tableName: 'variations'
  })

  Variations.associate = (models) => {
    Variations.hasMany(models.variation_options, {as: 'options'})
    Variations.belongsTo(models.variation_groups, {as: 'variation_group'});
  }

  return Variations
}
