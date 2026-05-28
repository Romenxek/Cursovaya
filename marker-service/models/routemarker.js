'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RouteMarker extends Model {

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
  RouteMarker.init({
    marker_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'RouteMarker',
    underscored: true,
    tableName: "RouteMarkers"
  });
  return RouteMarker;
};