const TutorRepository = require('../repositories/tutor.repository');

class TutorService {
  tutorRepository = new TutorRepository();

  getTutor = async ({ tutor_id }) => {
    const tutorData = await this.tutorRepository.findTutor({ tutor_id });
    return tutorData;
  };

  creatTutor = async ({ user_id, school_name, career }) => {
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
  deleteReport = async ({ tutor_id, user_id }) => {
    const tutorData = await this.tutorRepository.deleteTutor({ tutor_id, user_id });
    return tutorData;
  };
}
module.exports = TutorService;
