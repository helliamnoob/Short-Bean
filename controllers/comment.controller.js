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
    const { post_id } = req.params;
    try {
      // if (!req.headers.authorization) {
      //   return res.status(401).json({ error: '인증 정보가 필요합니다.' });
      // }
      const { code, data } = await this.commentService.findAllComment({
        post_id,
      });

      if (code === 404) {
        res.status(404).json({ errorMessage: '존재하는 댓글이 없습니다.' });
      } else {
        res.status(code).json({ data });
      }
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // 댓글 상세 조회
  findPostComment = async (req, res) => {
    const { comment_id } = req.params;

    try {
      const { code, data } = await this.commentService.findPostComment({
        comment_id,
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
      const { user_id } = res.locals.user;
      const { post_id } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: '댓글 내용은 필수입니다.' });
      }

      const { code, message } = await this.commentService.createComment({
        user_id,
        post_id,
        content,
      });
      return res.status(code).json({ message });
    } catch (error) {
      console.error(error);

      return this.handleError(res, error);
    }
  };

  // 댓글 수정
  updateComment = async (req, res) => {
    try {
      const { user_id } = res.locals.user;
      const { comment_id } = req.params;
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({ error: '수정할 내용이 없습니다.' });
      }

      // 댓글 ID와 사용자 ID로 댓글을 찾습니다.
      const comment = await Comments.findOne({ where: { comment_id, user_id } });

      if (!comment) {
        return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
      }

      const { code, message } = await this.commentService.updateComment({
        user_id,
        comment_id,
        content,
      });
      return res.status(code).json({ message });
    } catch (error) {
      return this.handleError(res, error);
    }
  };

  // 댓글 삭제
  deleteComment = async (req, res) => {
    try {
      const { comment_id } = req.params;
      const { user_id } = res.locals.user;

      if (!comment_id) {
        return res.status(400).json({ error: '댓글 ID가 필요합니다.' });
      }

      // 댓글 ID와 사용자 ID로 댓글을 찾습니다.
      const comment = await Comments.findOne({ where: { comment_id, user_id } });

      if (!comment) {
        return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
      }

      const { code, message } = await this.commentService.deleteComment({
        comment_id,
        user_id,
      });

      return res.status(code).json({ message });
    } catch (error) {
      return this.handleError(res, error);
    }
  };
}

module.exports = CommentController;
