'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.RouteMarker, {
          foreignKey: 'route_id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
      })
    }
  }
  Route.init(
    { }, {
    sequelize,
    modelName: 'Route',
    underscored: true
  });
  return Route;
};