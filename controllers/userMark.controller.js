const UserMarkService = require('../services/userMark.service');
const TutorService = require('../services/tutor.service');

class UserMarkController {
  userMarkService = new UserMarkService();
  tutorService = new TutorService();

  getMark = async (req, res, next) => {
    try {
      const { user_id } = res.locals.user;
      const marks = await this.userMarkService.getMark(user_id);

      res.status(200).json({ data: marks });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  creatMark = async (req, res, next) => {
    try {
      const { tutor_id } = req.params;
      const { user_id } = res.locals.user;
      const check = await this.tutorService.checkTutor({ user_id });
      console.log(check);
      if (!check) {
        const marks = await this.userMarkService.creatMark({ tutor_id, user_id });

        res.status(201).json({ data: marks });
      } else {
        res.status(403).json({ message: '본인을 즐겨찾기 할 수 없습니다.' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  updateMark = async (req, res, next) => {
    try {
      const { user_mark_id, tutor_id } = req.params;
      const { user_id } = res.locals.user;
      const marks = await this.userMarkService.updateMark({ user_mark_id, tutor_id, user_id });

      res.status(200).json({ data: marks });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
  deleteMark = async (req, res, next) => {
    try {
      const { user_mark_id } = req.params;
      const { user_id } = res.locals.user;

      const marks = await this.userMarkService.deleteMark({ user_mark_id, user_id });

      res.status(200).json({ data: marks });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}
module.exports = UserMarkController;
