'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      this.hasOne(models.EmailVerificationToken,{
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  User.init({
    email: { 
      type: DataTypes.STRING,  
      allowNull: false,
      unique: true
    },
    password_hash: DataTypes.STRING,
    is_verified: DataTypes.BOOLEAN,
    is_admin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    tableName: "Users"
  });
  return User;
};