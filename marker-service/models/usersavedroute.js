'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserSavedRoute extends Model {

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
  UserSavedRoute.init({
    route_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserSavedRoute',
    underscored: true,
    tableName: "UserSavedRoutes"
  });
  return UserSavedRoute;
};