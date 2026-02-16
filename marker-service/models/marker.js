'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Marker extends Model {

    static associate(models) {
      this.hasMany(models.UserSavedMarkers,{
        foreignKey: 'marker_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasMany(models.RouteMarkers,{
        foreignKey: 'marker_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasOne(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Marker.init({
    name: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lon: DataTypes.DOUBLE,
    user_id: DataTypes.INTEGER,
    info: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Marker',
    underscored: true
  });
  return Marker;
};