const { Posts, Users } = require('../models');
const { Op, sequelize } = require('sequelize');

class PostRepository {
  findAllPost = async () => {
    return await Posts.findAll({ include: [{ model: Users }] });
  };

  findPost = async ({ postId }) => {
    return await Posts.findOne({ where: { postId } });
  };

  createPost = async ({ userId, image, content, subject }) => {
    return await Posts.create({ userId, image, content, subject });
  };

  updatePost = async ({ userId, postId, image, content, subject }) => {
    return await Posts.update(
      { image, content, subject },
      { where: { [Op.and]: [{ userId }, { postId }] } }
    );
  };

  deletePost = async ({ userId, postId }) => {
    return await Posts.destroy({
      where: { [Op.and]: [{ userId }, { postId }] },
    });
  };
}

module.exports = PostRepository;
