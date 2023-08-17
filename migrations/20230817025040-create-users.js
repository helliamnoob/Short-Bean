'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      StudentInfo: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: "StudentInfos",
          key: "studentId",
        },
      },
     TutorInfo: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: "TutorInfos",
          key: "tutorId",
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
      nickname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      userName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      birthDate: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('Users');
  }
};