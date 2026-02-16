'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSavedMarkers extends Model {

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
  UserSavedMarkers.init({
    user_id: DataTypes.INTEGER,
    marker_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'UserSavedMarkers',
    underscored: true
  });
  return UserSavedMarkers;
};