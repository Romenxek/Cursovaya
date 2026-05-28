'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailVerificationToken extends Model {

    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }
  EmailVerificationToken.init({
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
    },
    token: DataTypes.STRING,
    expires_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'EmailVerificationToken',
    underscored: true,
    tableName: "EmailVerificationTokens"
  });
  return EmailVerificationToken;
};