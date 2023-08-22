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
        defaultValue: '로그아웃',
        type: Sequelize.ENUM('로그아웃','로그인')
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