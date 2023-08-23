const ChatRepository = require('../repositories/chat.repository.js');

class ChatService {
  chatRepository = new ChatRepository();
  getAllUsers = async () => {
    try {
      const data = await this.chatRepository.getAllUsers();
      return { code: 200, data };
    } catch (err) {
      throw err;
    }
  };
}

module.exports = ChatService;
