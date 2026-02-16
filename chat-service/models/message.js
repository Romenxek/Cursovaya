'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      this.belongsTo(models.User,{
        foreignKey: 'sender_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.belongsTo(models.User,{
        foreignKey: 'reciever_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      this.hasOne(models.Photo,{
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Message.init({
    sender_id: DataTypes.INTEGER,
    reciever_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Message',
    underscored: true
  });
  return Message;
};