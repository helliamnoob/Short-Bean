const express = require('express');
const router = express.Router();

// 로그인 인증부분
const auth = require('../middlewares/auth_middleware');

const { upload } = require('../middlewares/upload_middleware');

const PostController = require('../controllers/post.controller');
const postController = new PostController();

// 게시글 전체 조회
router.get('/post', postController.getAllPost);

// 게시글 상세 조회
router.get('/post/:post_id', postController.getPost);

// 게시글 생성
router.post('/post', auth, upload.array('image'), postController.createPost);

// 게시글 수정
router.put('/post/:post_id', auth, upload.array('image'), postController.updatePost);

// 게시글 삭제
router.delete('/post/:post_id', auth, postController.deletePost);

// 게시글 검색
router.get('/search_post', postController.searchPost);

// // 게시글 좋아요순 조회
// router.get('/posts/likes', postController.getPostOrderByLikes);

module.exports = router;
