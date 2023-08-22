const { Comments, Users } = require('../models');
const { Op } = require('sequelize');

class CommentRepository {
  findAllComment = async ({ postId }) => {
    return await Comments.findAll({
      where: { postId },
      include: [{ model: Users }],
    });
  };

  findComment = async ({ commentId }) => {
    return await Comments.findOne({ where: { commentId } });
  };

  createComment = async ({ userId, postId, comment }) => {
    return await Comments.create({ userId, postId, comment });
  };

  updateComment = async ({ userId, commentId, comment }) => {
    await Comments.update(
      { comment },
      { where: { commentId, UserId: userId } }
    );
  };

  deleteComment = async ({ userId, commentId }) => {
    await Comments.destroy({
      where: { commentId, UserId: userId },
    });
  };
}

module.exports = CommentRepository;
