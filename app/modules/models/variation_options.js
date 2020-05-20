/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  const VariationOption = sequelize.define('variation_options', {
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    value: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '0.00000000'
    }
  }, {
    tableName: 'variation_options'
  })

  VariationOption.associate = (models) => {
    VariationOption.belongsTo(models.variations)
  }

  return VariationOption
}
