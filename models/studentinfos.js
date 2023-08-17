'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class StudentInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasone(models.Users, {
        sourceKey: "studentId",
        foreignKey: "StudentInfo",
      });
    }
  }
  StudentInfos.init({
    studentId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    shcoolName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    grade: {
      allowNull: false,
      type: DataTypes.BIGINT
    },
    studentIdcard: {
      allowNull: false,
      type: DataTypes.STRING
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
    modelName: 'StudentInfos',
  });
  return StudentInfos;
};