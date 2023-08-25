const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller.js');
const chatController = new ChatController();
const authMiddleware = require('../middlewares/auth_middleware');

router.get('/users', chatController.getAllUsers);
router.get('/rooms', authMiddleware, chatController.getRooms); // 메시지 까지 가져오는 로직 추가
router.post('/rooms', authMiddleware, chatController.createRooms);
router.post('/message', authMiddleware, chatController.sendMsg); // 오프라인

module.exports = router;

// 유저조회, 룸넘버가져오기 or 만들기, 오프라인이랑 대화하기
