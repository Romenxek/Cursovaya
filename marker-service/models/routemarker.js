'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RouteMarkers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Route,{
        foreignKey: 'route_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      this.hasMany(models.Marker,{
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