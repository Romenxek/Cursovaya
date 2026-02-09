'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserSavedMarkers', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      marker_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Markers',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserSavedMarkers');
  }
};