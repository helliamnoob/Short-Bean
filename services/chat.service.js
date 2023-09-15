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
      if (!targetUser) throw new Error('대상유저가 존재하지 않습니다.');

      const roomInfo = await this.chatRepository.getRooms(userId, targetId);
      if (!roomInfo) throw new Error('방이 존재하지 않습니다. 방을 만들어 주세요');
      return { code: 200, data: roomInfo };
    } catch (err) {
      throw err;
    }
  };
  getMessage = async (roomId) => {
    try {
      const msgData = await this.chatRepository.getMessage(roomId);
      return { code: 200, data: msgData };
    } catch (err) {
      throw err;
    }
  };

  createRooms = async (userId, targetId) => {
    try {
      if (userId == targetId) throw new Error('본인과 대화할 수 없습니다.');
      const targetUser = this.chatRepository.getUserById(targetId);
      if (!targetUser) throw new Error('대상유저가 존재하지 않습니다.');

      const roomInfo = await this.chatRepository.getRooms(userId, targetId);
      if (roomInfo) throw new Error('이미 방이 존재합니다.');
      // 프론트에서 방이 없을 때 호출할 메소드라 이 검증은 필요없을 수 있다.
      await this.chatRepository.createRooms(userId, targetId);
      return { code: 200, message: '새로운 방을 만들었습니다. 다시 연결해주세요' };
    } catch (err) {
      throw err;
    }
  };

  sendMsg = async (roomId, userId, chatMsg) => {
    try {
      if (!chatMsg) throw new Error('메시지 내용을 입력해주세요');
      const roomInfo = await this.chatRepository.getRoomsByRoomId(roomId);
      const is_send = roomInfo.user_id === userId ? true : false;

      await this.chatRepository.sendMsg(roomId, is_send, chatMsg);
      return { code: 200, message: '메시지 전송 완료' };
    } catch (err) {
      throw err;
    }
  };

  getMyInfo = async (userId) => {
    try {
      const myInfo = await this.chatRepository.getMyInfoById(userId);
      return { code: 200, data: myInfo };
    } catch (err) {
      throw err;
    }
  };
}

module.exports = ChatService;
