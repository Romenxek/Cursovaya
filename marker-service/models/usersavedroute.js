'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSavedRoutes extends Model {

    static associate(models) {
      this.belongsTo(models.Route, {
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
  UserSavedRoutes.init({
    route_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserSavedRoutes',
    underscored: true
  });
  return UserSavedRoutes;
};