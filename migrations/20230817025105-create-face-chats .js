'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FaceChats', {
      facechat_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      tutor_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: 'TutorInfos',
          key: 'tutor_id',
        },
      },
      facechat_room_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
      },
      facechat_status: {
        allowNull: false,
        defaultValue: '채팅중',
        type: Sequelize.ENUM('채팅중', '나가기'),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('FaceChats');
  },
};