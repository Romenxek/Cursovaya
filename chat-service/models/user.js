'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Friendship, {
        foreignKey: 'fuid_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasMany(models.Friendship, {
        foreignKey: 'suid_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }); 
      this.hasMany(models.Message, {
        foreignKey: 'reciever_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasMany(models.Message, {
        foreignKey: 'sender_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  User.init({ }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    timestamps:false
  });
  return User;
};