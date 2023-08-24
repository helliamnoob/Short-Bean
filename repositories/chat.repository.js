const { Users, Chats } = require('../models');

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
      where: { user_id: userId, target_user_id: targetId },
    });
  };
}

module.exports = ChatRepository;
