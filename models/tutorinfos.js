'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TutorInfos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasone(models.Users, {
        sourceKey: "tutorId",
        foreignKey: "TutorInfo",
      });
    }
  }
  TutorInfos.init({
    tutorId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    schoolName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    career: {
      allowNull: false,
      type: DataTypes.STRING(200)
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
    modelName: 'TutorInfos',
  });
  return TutorInfos;
};