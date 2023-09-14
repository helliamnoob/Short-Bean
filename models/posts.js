'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
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
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.Comments, {
        sourceKey: 'post_id',
        foreignKey: 'post_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(models.Likes, {
        sourceKey: 'post_id',
        foreignKey: 'post_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Posts.init(
    {
      post_id: {
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
      image: {
        type: DataTypes.STRING(200),
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING(200),
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING(200),
      },
      subject: {
        allowNull: false,
        type: DataTypes.ENUM('국어', '수학', '영어'),
      },
      post_like: {
        allowNull: false,
        defaultValue: 0,
        type: DataTypes.BIGINT,
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
      modelName: 'Posts',
    }
  );
  return Posts;
};
