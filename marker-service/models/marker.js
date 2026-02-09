'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Marker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.UserSavedMarkers,{
        foreignKey: 'marker_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
      this.belongsTo(models.RouteMarkers,{
        foreignKey: 'marker_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }
  Marker.init({
    name: DataTypes.STRING,
    lat: DataTypes.DOUBLE,
    lon: DataTypes.DOUBLE,
    user_id: DataTypes.INTEGER,
    info: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Marker',
    underscored: true
  });
  return Marker;
};