const { TutorInfos } = require('../models');
const { Users } = require('../models');
const { Op } = require('sequelize');

class TutorRepository {
  findAllTutor = async () => {
    return await TutorInfos.findAll({ include: [{ model: Users }] });
  };

  createTutor = async ({ user_id, school_name, career }) => {
    const tutorData = await TutorInfos.create({
      user_id,
      school_name,
      career,
    });
    return tutorData;
  };

  findTutor = async ({ tutor_id, user_id }) => {
    const tutorData = await TutorInfos.findOne({
      where: { tutor_id: tutor_id },
      order: [['createdAt']],
    });
    return tutorData;
  };

  updateTutor = async ({ tutor_id, user_id, school_name }) => {
    const tutorData = await TutorInfos.update(
      { school_name },
      { where: { [Op.and]: [{ tutor_id: tutor_id }, { user_id: user_id }] } }
    );
    return tutorData;
  };

  updateTutorLike = async ({ tutor_like, tutor_id }) => {
    return await TutorInfos.update({ tutor_like }, { where: { tutor_id } });
  };

  deleteTutor = async ({ tutor_id, user_id }) => {
    const tutorData = await TutorInfos.destroy({
      where: {
        [Op.and]: [{ tutor_id: tutor_id }, { user_id: user_id }],
      },
    });
    return tutorData;
  };
}

module.exports = TutorRepository;
