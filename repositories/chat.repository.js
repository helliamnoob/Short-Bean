const { Users } = require('../models');

class ChatRepository {
  getAllUsers = async () => {
    return Users.findAll({});
  };
}

module.exports = ChatRepository;
