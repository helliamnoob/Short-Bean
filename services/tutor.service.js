const TutorRepository = require('../repositories/tutor.repository');

class TutorService {
  tutorRepository = new TutorRepository();

  getAllTutors = async () => {
    return await this.tutorRepository.findAllTutor();
  };

  getTutor = async ({ tutor_id }) => {
    const tutorData = await this.tutorRepository.findTutor({ tutor_id });
    if (!tutorData) throw new Error("Tutor doesn't exist");
    return tutorData;
  };
  checkTutor = async ({ user_id }) => {
    const tutorData = await this.tutorRepository;
  };
  creatTutor = async ({ user_id, school_name, career }) => {
    const tutorId = await this.tutorRepository.checkTutor({ user_id });
    if (tutorId) throw new Error('이미 튜터 신청하였습니다.');
    const tutorData = await this.tutorRepository.createTutor({
      user_id,
      school_name,
      career,
    });
    return tutorData;
  };
  updateTutor = async ({ tutor_id, user_id, school_name }) => {
    const tutorData = await this.tutorRepository.updateTutor({
      tutor_id,
      user_id,
      school_name,
    });
    return tutorData;
  };
  updateStatus = async ({ tutor_id, status }) => {
    const tutorData = await this.tutorRepository.updateStatus({
      tutor_id,
      status,
    });
    return tutorData;
  };

  deleteReport = async ({ tutor_id, user_id }) => {
    const tutorData = await this.tutorRepository.deleteTutor({ tutor_id, user_id });
    return tutorData;
  };
}
module.exports = TutorService;
