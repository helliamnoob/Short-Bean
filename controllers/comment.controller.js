const CommentController = require('../services/comment.service');
const { Comments } = require('../models');

class CommentController {
  commentService = new CommentService();

  // 댓글 전체 조회
  findAllComment = async (req, res) => {
    const { postId } = req.params;

    const { code, data } = await this.commentService.findAllComment({ postId });
    return res.status(code).json({ data });
  };

  // 댓글 조회
  findPostComment = async (req, res) => {
    const { commentId } = req.params;

    const { code, data } = await this.commentService.findPostComment({
      commentId,
    });
    return res.status(code).json({ data });
  };

  // 댓글 생성
  createComment = async (req, res) => {
    const { userId } = res.locals.user;
    const { postId } = req.params;
    const { comment } = req.body;

    const { code, data } = await this.commentService.createComment({
      userId,
      postId,
      comment,
    });
    return res.status(code).json({ data });
  };

  // 댓글 수정
  updateComment = async (req, res) => {
    const { userId } = res.locals.user;
    const { commentId } = req.params;
    const { comment } = req.body;

    const { code, data } = await this.commentService.updateComment({
      userId,
      commentId,
      comment,
    });
    return res.status(code).json({ data });
  };

  // 댓글 삭제
  deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals.user;

    const { code, data } = await this.commentService.deleteComment({
      commentId,
      userId,
    });
    return res.status(code).json({ data });
  };
}

module.exports = CommentController;
