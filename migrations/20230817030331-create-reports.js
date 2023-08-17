'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      reportId: {
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
      AdminId: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "Admins",
          key: "adminId",
        },
      },
      reportContent: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      reportedUserID: {
        allowNull: false,
        type: Sequelize.STRING
      },
      reportStatus: {
        allowNull: false,
        type: Sequelize.ENUM('처리중', '처리완료')
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
    await queryInterface.dropTable('Reports');
  }
};