'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserMarks extends Model {
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
      this.belongsTo(models.TutorInfos, {
        //  1:N 관계 설정을 합니다.
        targetKey: 'tutor_id',
        foreignKey: 'tutor_id',
      });
    }
  }
  UserMarks.init(
    {
      user_mark_id: {
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
      tutor_id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {
          model: 'TutorInfos',
          key: 'tutor_id',
        },
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
      modelName: 'UserMarks',
    }
  );
  return UserMarks;
};
