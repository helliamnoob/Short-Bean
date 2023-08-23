'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
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
    }
  }
  Reviews.init(
    {
      review_id: {
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
      review_content: {
        type: DataTypes.STRING(200),
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
      modelName: 'Reviews',
    }
  );
  return Reviews;
};
