const { TutorInfos } = require('../models');
const { Op } = require('sequelize');

class TutorRepository {
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
