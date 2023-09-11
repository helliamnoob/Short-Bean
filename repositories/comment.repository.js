const { Comments, Users } = require('../models');
const { Op, Sequelize } = require('sequelize');

class CommentRepository {
  findAllComment = async ({ post_id }) => {
    return await Comments.findAll({
      where: { post_id },
      include: [{ model: Users }],
      order: [['createdAt', 'DESC']], // 생성일자 내림차순
    });
  };

  findComment = async ({ comment_id }) => {
    return await Comments.findOne({ where: { comment_id }, order: [['createdAt', 'DESC']] });
  };

  createComment = async ({ user_id, post_id, content }) => {
    return await Comments.create({ user_id, post_id, content });
  };

  updateComment = async ({ user_id, comment_id, content }) => {
    await Comments.update({ content }, { where: { comment_id, user_id } });
  };
  
  deleteComment = async ({ user_id, comment_id }) => {
    await Comments.destroy({ where: { comment_id, user_id } });
  };
}

module.exports = CommentRepository;
