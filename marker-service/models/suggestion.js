'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Suggestion extends Model {

    static associate(models) {
      this.belongsTo(models.Marker, {
        foreignKey: 'marker_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Suggestion.init({
    user_id: DataTypes.INTEGER,
    marker_id: DataTypes.INTEGER,
    status: DataTypes.ENUM("consideration", "rejected")
  }, {
    sequelize,
    modelName: 'Suggestion',
    underscored: true,
    tableName: "Suggestions"
  });
  return Suggestion;
};