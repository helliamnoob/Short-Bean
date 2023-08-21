const express = require('express');
const router = express.Router();

// 로그인 인증부분
// const AuthMiddleware = require('../middleware/auth.middleware');
// const auth = new AuthMiddleware();

const CommentController = require('../controllers/comment.controller');
const PostController = require('../controllers/post.controller');
const commentController = new CommentController();

// 댓글 전체 조회
router.get('/post/comment', commentController.findAllComment);

// 댓글 상세 조회
router.get('/post/:postId/comment', commentController.findPostComment);

// 댓글 생성
router.post('/post/:postId/comment', auth, commentController.createComment);

// 댓글 수정
router.put(
  '/post/:postId/comment/:commentId',
  auth,
  commentController.updateComment
);

// 댓글 삭제
router.delete(
  '/post/:postId/comment/:commentId',
  auth,
  commentController.deleteComment
);

module.exports = router;
