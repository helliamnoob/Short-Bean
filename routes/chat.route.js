const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chat.controller.js');
const chatController = new ChatController();

router.get('/users', chatController.getAllUsers);

module.exports = router;
