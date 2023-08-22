const CommentService = require('../services/comment.service');
const { Comments } = require('../models');

class CommentController {
  commentService = new CommentService();

  handleError(res, error) {
    if (error.code) {
      return res.status(error.code).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).send('알 수 없는 에러가 발생했습니다.');
  }

  // 댓글 전체 조회
  findAllComment = async (req, res) => {
    const { postId } = req.params;
    try {
      if (!req.headers.authorization) {
        return res.status(401).json({ error: '인증 정보가 필요합니다.' });
      }
      const { code, data } = await this.commentService.findAllComment({
        postId,
      });

      if (code === 404) {
        res.status(404).json({ errorMessage: '존재하는 댓글이 없습니다.' });
      }
      return res.status(code).json({ data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // 댓글 상세 조회
  findPostComment = async (req, res) => {
    const { commentId } = req.params;

    try {
      const { code, data } = await this.commentService.findPostComment({
        commentId,
      });

      if (code === 404) {
        res.status(404).json({ errorMessage: '존재하는 댓글이 없습니다.' });
      }
      return res.status(code).json({ data });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // 댓글 생성
  createComment = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;
      const { comment } = req.body;

      if (!comment) {
        return res.status(400).json({ error: '댓글 내용은 필수입니다.' });
      }

      const { code, message } = await this.commentService.createComment({
        userId,
        postId,
        comment,
      });
      return res.status(code).json({ message });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // 댓글 수정
  updateComment = async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { commentId } = req.params;
      const { comment } = req.body;

      if (!comment) {
        return res.status(400).json({ error: '수정할 내용이 없습니다.' });
      }

      const { code, message } = await this.commentService.updateComment({
        userId,
        commentId,
        comment,
      });
      return res.status(code).json({ message });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // 댓글 삭제
  deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId } = res.locals.user;

      if (!commentId) {
        return res.status(400).json({ error: '댓글 ID가 필요합니다.' });
      }

      const { code, message } = await this.commentService.deleteComment({
        commentId,
        userId,
      });

      return res.status(code).json({ message });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}

module.exports = CommentController;
