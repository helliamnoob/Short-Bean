'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FaceChats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, { //  1:N 관계 설정을 합니다.
        targetKey: 'userId', 
        foreignKey: 'UserId', 
      });
      this.belongsTo(models.TutorInfos, { //  1:N 관계 설정을 합니다.
        targetKey: 'tutorId', 
        foreignKey: 'TutorId', 
      });
    }
  }
  FaceChats.init({
    chatId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    UserId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      references: {
        model: "Users",
        key: "userId",
      },
    },
    TutorId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      references: {
        model: "TutorInfos",
        key: "tutorId",
      },
    },
    faceChatRoomId: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
    faceChatStatus: {
      allowNull: false,
      defaultValue: '채팅중',
      type: DataTypes.ENUM('채팅중','나가기')
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
    modelName: 'FaceChats',
  });
  return FaceChats;
};