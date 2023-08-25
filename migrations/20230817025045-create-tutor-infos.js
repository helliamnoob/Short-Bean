'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TutorInfos', {
      tutor_id: {
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
      school_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      career: {
        allowNull: false,
        type: Sequelize.STRING(200),
      },
      status: {
        allowNull: false,
        defaultValue: '로그아웃',
        type: Sequelize.ENUM('로그아웃', '로그인'),
      },
      tutor_like: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.BIGINT
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
    await queryInterface.dropTable('TutorInfos');
  },
};