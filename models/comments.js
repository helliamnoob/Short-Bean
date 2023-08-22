'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Posts, { //  1:N 관계 설정을 합니다.
        targetKey: 'post_id', 
        foreignKey: 'post_id', 
      });
    }
  }
  Comments.init({
    comment_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    post_id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      references: {
        model: "Posts",
        key: "post_id",
      },
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING(200)
    },
    selection: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
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
    modelName: 'Comments',
  });
  return Comments;
};
