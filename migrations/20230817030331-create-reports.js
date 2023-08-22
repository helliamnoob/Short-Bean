'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reports', {
      report_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      reportContent: {
        allowNull: false,
        type: Sequelize.STRING(200)
      },
      reporteduser_id: {
        allowNull: false,
        type: Sequelize.STRING
      },
      reportStatus: {
        allowNull: false,
        defaultValue: '처리중',
        type: Sequelize.ENUM('처리중', '처리완료','처리취소')
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