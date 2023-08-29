const TutorService = require('../services/tutor.service');

class TutorController {
  tutorService = new TutorService();

  getAllTutors= async (req, res) => {
    try {
        const tutors = await this.tutorService.getAllTutors();
        res.status(200).json(tutors);
    } catch (error) {
        console.error('Error getting tutors:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

  getTutor = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const { tutor_id } = req.params;
      const tutor = await this.tutorService.getTutor({ tutor_id });
      res.status(200).json({ data: tutor });
    } catch (error) {
      console.log('컨트롤에러');
      return res.status(500).json({ message: error.message });
    }
  };

  creatTutor = async (req, res, next) => {
    try {
      const { school_name, career } = req.body;
      const { user_id } = res.locals.user;

      console.log(user_id, school_name, career);

      const tutor = await this.tutorService.creatTutor({
        user_id,
        school_name,
        career,
      });
      res.status(201).json({ data: tutor });
    } catch (error) {
      console.log('컨트롤에러');
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
}
module.exports = TutorController;
