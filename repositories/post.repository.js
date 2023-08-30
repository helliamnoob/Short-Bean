const { Posts, Users } = require('../models');
const { Op } = require('sequelize');

class PostRepository {
  findAllPost = async () => {
    // include Users 생략할까? 결과값이 쓸데없이 자세한 것 같은데..
    return await Posts.findAll({ include: [{ model: Users }] });
  };

  findPost = async ({ post_id }) => {
    return await Posts.findOne({ where: { post_id: parseInt(post_id) } });
  };

  createPost = async ({ user_id, title, content, subject, image }) => {
    return await Posts.create({ user_id, title, content, subject, image });
  };

  updatePost = async ({ user_id, post_id, title, content, subject, image }) => {
    return await Posts.update(
      { title, content, subject, image },
      { where: { [Op.and]: [{ user_id }, { post_id }] } }
    );
  };

  deletePost = async ({ user_id, post_id }) => {
    return await Posts.destroy({
      where: { [Op.and]: [{ user_id }, { post_id }] },
    });
  };
}

module.exports = PostRepository;
