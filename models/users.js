'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.StudentInfos, { //  1:N 관계 설정을 합니다.
        targetKey: 'studentId', 
        foreignKey: 'StudentInfo', 
      });
      this.belongsTo(models.TutorInfos, { //  1:N 관계 설정을 합니다.
        targetKey: 'tutorId', 
        foreignKey: 'TutorInfo', 
      });
      this.belongsTo(models.Admins, { //  1:N 관계 설정을 합니다.
        targetKey: 'adminId', 
        foreignKey: 'AdminId', 
      });
      this.hasMany(models.Posts, {
        sourceKey: "userId",
        foreignKey: "UserId",
      });
      this.hasMany(models.Chats, {
        sourceKey: "userId",
        foreignKey: "UserId",
      });
      this.hasMany(models.Reviews, {
        sourceKey: "userId",
        foreignKey: "UserId",
      });
      this.hasMany(models.Reports, {
        sourceKey: "userId",
        foreignKey: "UserId",
      });
      this.hasMany(models.UserMarks, {
        sourceKey: "userId",
        foreignKey: "UserId",
      });
    }
  }
  Users.init({
    userId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    StudentInfo: {
      allowNull: true,
      type: DataTypes.BIGINT,
      references: {
        model: "StudentInfos",
        key: "studentId",
      },
    },
   TutorInfo: {
      allowNull: true,
      type: DataTypes.BIGINT,
      references: {
        model: "TutorInfos",
        key: "tutorId",
      },
    },
    AdminId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      references: {
        model: "Admins",
        key: "adminId",
      },
    },
    nickname: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    phoneNumber: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
    birthDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};