const ChatService = require('../services/chat.service.js');
class ChatController {
  chatService = new ChatService();

  getAllUsers = async (req, res) => {
    try {
      const result = await this.chatService.getAllUsers();
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  };

  getRooms = async (req, res) => {
    try {
      const userId = res.locals.user.user_id;
      // userId 없으면 그냥 바로 리턴
      const { targetId } = req.body;
      const result = await this.chatService.getRooms(userId, targetId);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ err: err.message });
    }
  };
  getMessage = async (req, res) => {
    try {
      const { roomId } = req.body;
      const result = await this.chatService.getMessage(roomId);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ err: err.message });
    }
  };

  createRooms = async (req, res) => {
    try {
      const userId = res.locals.user.user_id;
      const { targetId } = req.body;
      const result = await this.chatService.createRooms(userId, targetId);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  };
  sendMsg = async (req, res) => {
    try {
      const userId = res.locals.user.user_id;
      const { chatMsg, roomId } = req.body; // room_id는 url파라미터 값으로 가져올 생각입니다.
      const result = await this.chatService.sendMsg(roomId, userId, chatMsg);
      if (result.data) return res.status(result.code).json({ data: result.data });
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ err: err.message });
    }
  };
}

module.exports = ChatController;
