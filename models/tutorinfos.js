'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TutorInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Users, {
        //  1:N 관계 설정을 합니다.
        targetKey: 'user_id',
        foreignKey: 'user_id',
      });
      this.hasMany(models.UserMarks, {
        sourceKey: 'tutorId',
        foreignKey: 'TutorId',
      });
      this.hasMany(models.Chats, {
        sourceKey: 'tutorId',
        foreignKey: 'TutorId',
      });
      this.hasMany(models.FaceChats, {
        sourceKey: 'tutorId',
        foreignKey: 'TutorId',
      });
    }
  }
  TutorInfos.init(
    {
      tutor_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {
          model: 'Users',
          key: 'user_id',
        },
      },
      school_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      career: {
        allowNull: false,
        type: DataTypes.STRING(200),
      },
      status: {
        allowNull: false,
        defaultValue: '로그아웃',
        type: DataTypes.ENUM('로그아웃', '로그인'),
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
      },
    },
    {
      sequelize,
      modelName: 'TutorInfos',
    }
  );
  return TutorInfos;
};
