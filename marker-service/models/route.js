'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Route extends Model {
    
    static associate(models) {
      this.hasMany(models.RouteMarkers, {
          foreignKey: 'route_id',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
      });
      this.hasMany(models.UserSavedRoutes, {
          foreignKey: 'route_id',
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
  Route.init({ 
      user_id: DataTypes.INTEGER,
    }, {
    sequelize,
    modelName: 'Route',
    underscored: true
  });
  return Route;
};