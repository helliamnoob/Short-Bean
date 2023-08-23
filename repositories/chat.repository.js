const { Users } = require('../models');

class ChatRepository {
  getAllUsers = async () => {
    return await Users.findAll({
      attributes: ['user_id', 'nickname'],
    });
  };
}

module.exports = ChatRepository;
