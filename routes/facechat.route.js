const express = require('express');
const FacechatController = require('../controllers/facechat.controller');
const facechatController = new FacechatController();
const router = express.Router();

router.post('/create', facechatController.createChat);
router.put('/leave/:facechat_id', facechatController.leaveChat);
router.get('/:facechat_id', facechatController.getChat);


module.exports = router;
