'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {

    static associate(models) {
      this.belongsTo(models.Message,{
        foreignKey: 'message_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  Photo.init({
    message_id: DataTypes.INTEGER,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Photo',
    underscored: true
  });
  return Photo;
};