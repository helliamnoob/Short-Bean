'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TutorInfos', {
      tutorId: {
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
      schoolName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      career: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      status: {
        allowNull: false,
        defaultValue: '처리중',
        type: Sequelize.ENUM('처리중','승인','반려')
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
    await queryInterface.dropTable('TutorInfos');
  }
};