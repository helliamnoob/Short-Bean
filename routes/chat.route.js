const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller.js');
const chatController = new ChatController();
const authMiddleware = require('../middlewares/auth_middleware');

router.get('/users', chatController.getAllUsers);
// 모든 유저 조회
router.get('/rooms', authMiddleware, chatController.getRooms);
// 방 가져오기
router.get('/message', authMiddleware, chatController.getMessage);
// 방에 대한 메시지 가져오기
router.post('/rooms', authMiddleware, chatController.createRooms);
// 방 만들기
router.post('/message', authMiddleware, chatController.sendMsg);
// 오프라인 유저에게 메시지 보내기
router.get('/myInfos', authMiddleware, chatController.getMyInfo);

module.exports = router;

// 유저조회, 룸넘버가져오기 or 만들기, 오프라인이랑 대화하기
