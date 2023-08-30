const { Users, Chats, TutorInfos } = require('../models');
const Chat = require('../schemas/chat');
const { Op } = require('sequelize');

class ChatRepository {
  getAllUsers = async () => {
    return await Users.findAll({
      attributes: ['user_id', 'nickname', 'user_name'],
      include: [
        {
          model: TutorInfos,
        },
      ],
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
      where: {
        [Op.or]: [
          { user_id: userId, target_user_id: targetId },
          { user_id: targetId, target_user_id: userId },
        ],
      },
    });
  };

  getMessage = async (roomId) => {
    return await Chat.find({ room_id: roomId })
      .sort({ created_at: -1 })
      .select('is_send message_content created_at')
      .exec();
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
  getMyInfoById = async (userId) => {
    return await Users.findOne({
      include: [
        {
          model: TutorInfos,
        },
      ],
      where: { user_id: userId },
    });
  };
}

module.exports = ChatRepository;
