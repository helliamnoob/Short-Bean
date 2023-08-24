const express = require('express');
const router = express.Router();

// // 로그인 인증 부분
// const auth = require('../middlewares/auth_middleware');

// const LikeController = require('../controllers/like.controller');
// const likeController = new LikeController();

// // 좋아요 조회
// router.get('/post/:postId/like', likeController.getLike);

// // 좋아요 추가, 취소
// router.put('/post/:postId/like', auth, likeController.createLike);

module.exports = router;
