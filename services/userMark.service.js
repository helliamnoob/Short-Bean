const UserMarkRepository = require('../repositories/userMark.repository');
const TutorInfosRepository = require('../repositories/tutor.repository');

class UserMarkService {
  userMarkRepository = new UserMarkRepository();
  tutorRepository = new TutorInfosRepository();

  getMark = async () => {
    const markData = await this.userMarkRepository.findMark();
    return markData;
  };

  creatMark = async ({ tutor_id, user_id }) => {
    const tutor = await this.tutorRepository.findTutor({ tutor_id });
    const userMark = await this.userMarkRepository.findMark({ tutor_id, user_id });
    console.log('Mark:', userMark);
    if (!tutor) {
      return console.log('튜터없음');
    } else {
      if (!userMark) {
        await this.userMarkRepository.createMark({
          tutor_id,
          user_id,
        });
        await this.tutorRepository.updateTutorLike({ tutor_like: tutor.tutor_like + 1, tutor_id });
        console.log('즐겨찾기');
        return userMark;
      } else {
        await this.tutorRepository.updateTutorLike({ tutor_like: tutor.tutor_like - 1, tutor_id });

        await this.userMarkRepository.destroyMark({ user_mark_id: userMark.user_mark_id, user_id });
        console.log('즐겨찾기취소');
        return userMark;
      }
    }
  };
  updateMark = async ({ user_mark_id, tutor_id, user_id }) => {
    const markData = await this.userMarkRepository.updateMark({ user_mark_id, tutor_id, user_id });
  };
  deleteMark = async ({ user_mark_id, user_id }) => {
    const markData = await this.userMarkRepository.destroyMark({ user_mark_id, user_id });
    return markData;
  };
}
module.exports = UserMarkService;
