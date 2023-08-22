const CommentRepository = require('../repositories/comment.repository');
const { Comments } = require('../models');
class CommentService {
  commentRepository = new CommentRepository();

  // 댓글 전체 조회
  findAllComment = async ({ postId }) => {
    try {
      const data = await this.commentRepository.findAllComment({ postId });
      return { code: 200, data };
    } catch (error) {
      console.error(error);
      return { code: 500, message: '댓글 조회 중 오류가 발생했습니다.' };
    }
  };

  // 댓글 조회
  findPostComment = async ({ commentId }) => {
    try {
      const data = await this.commentRepository.findComment({ commentId });

      return { code: 200, data };
    } catch (error) {
      console.error(error);

      return { code: 500, message: '댓글 상세 조회 중 오류가 발생했습니다.' };
    }
  };

  // 댓글 작성
  createComment = async ({ userId, postId, comment }) => {
    try {
      await this.commentRepository.createComment({
        userId,
        postId,
        comment,
      });

      return { code: 200, message: '댓글 작성이 완료되었습니다.' };
    } catch (error) {
      console.error(error);
      return { code: 500, message: '댓글 작성 중 오류가 발생했습니다.' };
    }
  };

  updateComment = async ({ userId, commentId, comment }) => {
    try {
      await this.commentRepository.updateComment({
        userId,
        commentId,
        comment,
      });
      return { code: 200, message: '댓글을 수정하였습니다.' };
    } catch (error) {
      console.error(error);
      return { code: 500, message: '댓글 수정 중 오류가 발생했습니다.' };
    }
  };

  deleteComment = async ({ commentId, userId }) => {
    try {
      await this.commentRepository.deleteComment({ userId, commentId });
      return { code: 200, message: '댓글을 삭제하였습니다.' };
    } catch (error) {
      console.error(error);
      return { code: 500, message: '댓글 삭제 중 오류가 발생했습니다.' };
    }
  };
}

module.exports = CommentService;
