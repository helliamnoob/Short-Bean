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
}

module.exports = ChatController;
