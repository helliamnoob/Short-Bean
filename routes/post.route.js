const express = require('express');
const router = express.Router();

// 로그인 인증부분
const auth = require('../middlewares/auth_middleware');
// const auth = AuthMiddleware();

const PostController = require('../controllers/post.controller');
const postController = new PostController();

// 게시글 전체 조회
router.get('/post', postController.getAllPost);

// 게시글 상세 조회
router.get('/post/:postId', postController.getPost);

// 게시글 생성
router.post('/post', auth, postController.createPost);

// 게시글 수정
router.post('/post/:postId', auth, postController.updatePost);

// 게시글 삭제
router.post('/post/:postId', auth, postController.deletePost);

module.exports = router;
