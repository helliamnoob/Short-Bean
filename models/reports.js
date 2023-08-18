'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reports extends Model {
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
      this.belongsTo(models.Admins, { //  1:N 관계 설정을 합니다.
        targetKey: 'adminId', 
        foreignKey: 'AdminId', 
      });
    }
  }
  Reports.init({
    reportId: {
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
    AdminId: {
      allowNull: false,
      type: DataTypes.BIGINT,
      references: {
        model: "Admins",
        key: "adminId",
      },
    },
    reportContent: {
      allowNull: false,
      type: DataTypes.STRING(200)
    },
    reportedUserID: {
      allowNull: false,
      type: DataTypes.STRING
    },
    reportStatus: {
      allowNull: false,
      defaultValue: '처리중',
      type: DataTypes.ENUM('처리중', '처리완료','처리취소')
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
    modelName: 'Reports',
  });
  return Reports;
};