'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Friendship extends Model {
    static associate(models) {
      this.belongsTo(models.User,{
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.belongsTo(models.User,{
        foreignKey: 'friend_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Friendship.init({
    user_id: DataTypes.INTEGER,
    friend_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Friendship',
    underscored: true
  });
  return Friendship;
};