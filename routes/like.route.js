const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth_middleware');

const LikeController = require('../controllers/like.controller');
const likeController = new LikeController();

router.get('/post/:post_id/likes', auth, likeController.getLike);
router.post('/post/:post_id/likes', auth, likeController.createLike);
router.delete('/post/:post_id/likes', auth, likeController.destroyLike);

//게시글 전체의 좋아요 개수 조회
router.get('/post/likes', likeController.getAllPostLike);

module.exports = router;
