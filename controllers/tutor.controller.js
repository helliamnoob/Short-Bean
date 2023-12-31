const TutorService = require('../services/tutor.service');

class TutorController {
  tutorService = new TutorService();

  getAllTutors = async (req, res) => {
    try {
      const tutors = await this.tutorService.getAllTutors();
      res.status(200).json(tutors);
    } catch (error) {
      console.error('Error getting tutors:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  getTutor = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { tutor_id } = req.params;
      const tutor = await this.tutorService.getTutor({ tutor_id });
      res.status(200).json({ data: tutor });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  creatTutor = async (req, res, next) => {
    try {
      const { school_name, career } = req.body;
      const { user_id } = res.locals.user;

      const tutor = await this.tutorService.creatTutor({
        user_id,
        school_name,
        career,
      });
      res.status(201).json({ data: tutor });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  updateTutor = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { tutor_id } = req.params;
      const { school_name } = req.body;
      const tutor = await this.tutorService.updateTutor({ tutor_id, user_id, school_name });

      res.status(200).json({ data: tutor });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  updateStatus = async (req, res, next) => {
    try {
      const { tutor_id } = req.params;
      const { status } = req.body;
      const tutor = await this.tutorService.updateStatus({ tutor_id, status });

      res.status(200).json({ data: tutor });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  deleteTutor = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { tutor_id } = req.params;
      const tutor = await this.tutorService.deleteTutor({ tutor_id, user_id });
      res.status(200).json({ data: tutor });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  getByLikes = async (req, res, next) => {
    try {
      console.log('control에러낫어여111111');
      const tutor = await this.tutorService.getByLikes();
      res.status(200).json(tutor);
    } catch (error) {
      console.log('control에러낫어여');
      return res.status(500).json({ message: error.message });
    }
  };
}
module.exports = TutorController;
