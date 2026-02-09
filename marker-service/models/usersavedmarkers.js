'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSavedMarkers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Marker, {
        foreignKey: 'marker_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }
  UserSavedMarkers.init({
    user_id: DataTypes.INTEGER,
    marker_id: DataTypes.INTEGER,
    saved_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserSavedMarkers',
    underscored: true
  });
  return UserSavedMarkers;
};