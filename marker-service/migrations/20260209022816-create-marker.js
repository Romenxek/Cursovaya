'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Markers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      lat: {
        type: Sequelize.DOUBLE
      },
      lon: {
        type: Sequelize.DOUBLE
      },
      created_by_id: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      info: {
        type: Sequelize.JSON
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Markers');
  }
};