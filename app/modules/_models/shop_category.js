/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('shop_category', {
    loja_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    categoria_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'shop_category'
  });
};
