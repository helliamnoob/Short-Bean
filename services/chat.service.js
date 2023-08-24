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
  getRooms = async (userId, targetId) => {
    try {
      if (userId == targetId) throw new Error('본인과 대화할 수 없습니다.');
      const targetUser = this.chatRepository.getUserById(targetId);
      if (!targetUser) {
        throw new Error('대상유저가 존재하지 않습니다.');
      }
      const roomInfo = await this.chatRepository.getRooms(userId, targetId);
      return { code: 200, data: roomInfo };
    } catch (err) {
      throw err;
    }
  };
}

module.exports = ChatService;
