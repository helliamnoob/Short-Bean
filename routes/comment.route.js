const express = require('express');
const router = express.Router();

// 로그인 인증부분
const authMiddleware = require('../middlewares/auth_middleware');
// console.log('authMiddleware:', authMiddleware);

const CommentController = require('../controllers/comment.controller');
const commentController = new CommentController();

// 댓글 전체 조회
router.get('/post/:post_id/comment', commentController.findAllComment);

// 댓글 상세 조회
router.get('/post/:post_id/comment/:comment_id', commentController.findPostComment);

// 댓글 생성
router.post('/post/:post_id/comment', authMiddleware, commentController.createComment);

// 댓글 수정
router.put('/post/:post_id/comment/:comment_id', authMiddleware, commentController.updateComment);

// 댓글 삭제
router.delete(
  '/post/:post_id/comment/:comment_id',
  authMiddleware,
  commentController.deleteComment
);

module.exports = router;
