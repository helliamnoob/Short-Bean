const CommentRepository = require('../repositories/comment.repository');

class CommentService {
  commentRepository = new CommentRepository();

  // 댓글 전체 조회
  findAllComment = async ({ postId }) => {
    try {
      const comment = await this.commentRepository.findAllComment({ postId });
      return { code: 200, data: comment };
    } catch (error) {
      return { code: 500, data: error.message };
    }
  };

  // 댓글 조회
  findComment = async ({ commentId }) => {
    try {
      const comment = await this.commentRepository.findComment({ commentId });

      return { code: 200, data };
    } catch (error) {
      return { code: 500, message: '예기치 못한 문제가 발생했습니다.' };
    }
  };

  // 댓글 작성
  createComment = async ({ userId, postId, comment }) => {
    try {
      const createdComment = await this.commentRepository.createComment({
        userId,
        postId,
        comment,
      });

      return { code: 200, data };
    } catch (error) {}
  };
}

module.exports = CommentService;
