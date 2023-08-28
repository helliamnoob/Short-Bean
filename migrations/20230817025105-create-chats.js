'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
      chatId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      UserId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "Users",
          key: "userId",
        },
      },
      TutorId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "TutorInfos",
          key: "tutorId",
        },
      },
      chatRoomId: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      chatStatus: {
        allowNull: false,
        defaultValue: '채팅중',
        type: Sequelize.ENUM('채팅중','나가기')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chats');
  }
};