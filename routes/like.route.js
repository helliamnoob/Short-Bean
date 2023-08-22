const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const LikeController = require('../controllers/like.controller');
const likeController = new LikeController();

router.get('/post/:postId/likes', auth, likeController.getLike);
router.post('/post/:postId/likes', auth, likeController.createLike);
router.delete('/post/:postId/likes', auth, likeController.destroyLike);

module.exports = router;