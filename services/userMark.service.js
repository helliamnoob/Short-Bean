const UserMarkRepository = require('../repositories/userMark.repository');

class UserMarkService{
    userMarkRepository = new UserMarkRepository();

    getMark = async () => {
        const markData = await this.userMarkRepository.findMark();
        return markData
    }

    creatMark = async ({tutor_id, user_id}) => {
        const markData = await this.userMarkRepository.createMark({tutor_id, user_id});
        return markData;
    }
    updateMark = async ({user_mark_id, tutor_id, user_id}) =>{
        const markData = await this.userMarkRepository.updateMark({user_mark_id, tutor_id, user_id});
    }
    deleteMark = async ({user_mark_id, user_id}) => {
        const markData = await this.userMarkRepository.deleteMark({user_mark_id, user_id});
        return markData;
    }
}
module.exports = UserMarkService;