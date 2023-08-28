const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth_middleware');

const LikeController = require('../controllers/like.controller');
const likeController = new LikeController();

router.get('/post/:post_id/likes', auth, likeController.getLike);
router.post('/post/:post_id/likes', auth, likeController.createLike);
router.delete('/post/:post_id/likes', auth, likeController.destroyLike);

module.exports = router;
