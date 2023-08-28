'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserMarks', {
      userMarkId: {
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
    await queryInterface.dropTable('UserMarks');
  }
};