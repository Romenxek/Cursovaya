'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RouteMarkers extends Model {

    static associate(models) {
      this.belongsTo(models.Route,{
        foreignKey: 'route_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      this.belongsTo(models.Marker,{
        foreignKey: 'marker_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }
  RouteMarkers.init({
    marker_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'RouteMarkers',
    underscored: true
  });
  return RouteMarkers;
};