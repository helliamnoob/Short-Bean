const express = require('express');
const FacechatController = require('../controllers/facechat.controller');
const facechatController = new FacechatController();
const router = express.Router();

router.post('/facechat', facechatController.createChat);
router.put('/facechat/leave/:facechat_id', facechatController.leaveChat);
router.get('/facechat/:facechat_id', facechatController.getChat);

//추가용


module.exports = router;
