const CommentRepository = require('../repositories/comment.repository');
const { Comments } = require('../models');
class CommentService {
  commentRepository = new CommentRepository();

  // 댓글 전체 조회
  findAllComment = async ({ post_id }) => {
    try {
      const data = await this.commentRepository.findAllComment({ post_id });
      return { code: 200, data };
    } catch (error) {
      console.error(error);
      return { code: 500, message: '댓글 조회 중 오류가 발생했습니다.' };
    }
  };

  // 댓글 조회
  findPostComment = async ({ comment_id }) => {
    try {
      const data = await this.commentRepository.findComment({ comment_id });

      return { code: 200, data };
    } catch (error) {
      console.error(error);

      return { code: 500, message: '댓글 상세 조회 중 오류가 발생했습니다.' };
    }
  };

  // 댓글 작성
  createComment = async ({ user_id, post_id, content }) => {
    try {
      await this.commentRepository.createComment({
        user_id,
        post_id,
        content,
      });

      return { code: 200, message: '댓글 작성이 완료되었습니다.' };
    } catch (error) {
      console.error(error);
      return { code: 500, message: '댓글 작성 중 오류가 발생했습니다.' };
    }
  };

  updateComment = async ({ user_id, comment_id, content }) => {
    try {
      await this.commentRepository.updateComment({
        user_id,
        comment_id,
        content,
      });
      return { code: 200, message: '댓글을 수정하였습니다.' };
    } catch (error) {
      console.error(error);
      return { code: 500, message: '댓글 수정 중 오류가 발생했습니다.' };
    }
  };

  deleteComment = async ({ comment_id, user_id }) => {
    try {
      const comment = await this.commentRepository.findComment({ comment_id, user_id });
      
      if (!comment) {
        return { code: 404, message: '댓글을 찾을 수 없습니다.' };
      }
  
      await this.commentRepository.deleteComment({ user_id, comment_id });
      return { code: 200, message: '댓글을 삭제하였습니다.' };
    } catch (error) {
      console.error(error);
      return { code: 500, message: '댓글 삭제 중 오류가 발생했습니다.' };
    }
  };
}

module.exports = CommentService;
