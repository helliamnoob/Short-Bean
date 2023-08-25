const { Users, Chats } = require('../models');
const Chat = require('../schemas/chat');

class ChatRepository {
  getAllUsers = async () => {
    return await Users.findAll({
      attributes: ['user_id', 'nickname'],
    });
  };

  getUserById = async (targetId) => {
    return await Users.findOne({
      where: { user_id: targetId },
    });
  };

  getRooms = async (userId, targetId) => {
    return await Chats.findOne({
      attributes: ['chat_id', 'user_id', 'target_user_id'],
      where: { user_id: userId, target_user_id: targetId },
    });
  };

  getMessage = async (roomId) => {
    return await Chat.find({ room_id: roomId }).sort({ created_at: -1 }).exec();
  };

  getRoomsByRoomId = async (roomId) => {
    return await Chats.findOne({
      attributes: ['chat_id', 'user_id', 'target_user_id'],
      where: { chat_id: roomId },
    });
  };

  createRooms = async (userId, targetId) => {
    await Chats.create({
      user_id: userId,
      target_user_id: targetId,
    });
    return;
  };

  sendMsg = async (roomId, is_send, chatMsg) => {
    const newChat = new Chat({
      room_id: roomId,
      is_send,
      message_content: chatMsg,
    });

    await newChat.save();
    return;
  };
}

module.exports = ChatRepository;
