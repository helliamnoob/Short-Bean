const { UserMarks } = require('../models');
const { Op } = require('sequelize');

class UserMarkRepository {
  createMark = async ({ tutor_id, user_id }) => {
    const markData = await UserMarks.create({
      tutor_id,
      user_id,
    });
    return markData;
  };

  findMark = async (user_id) => {
    const markData = await UserMarks.findAll({
      where: { user_id: user_id },
      order: [['cratedAt']],
    });
    return markData;
  };

  updateMark = async ({ user_mark_id, tutor_id, user_id }) => {
    const markData = await UserMarks.update(
      { tutor_id },
      { where: { [Op.and]: [{ user_mark_id: user_mark_id }, { user_id: user_id }] } }
    );
    return markData;
  };

  deleteMark = async ({ user_mark_id, user_id }) => {
    const markData = await UserMarks.findOne({
      [Op.and]: [{ user_mark_id: user_mark_id }, { user_id: user_id }],
    });
    return markData;
  };
}

module.exports = UserMarkRepository;
