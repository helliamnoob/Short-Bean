const UserMarkRepository = require('../repositories/userMark.repository');

class UserMarkService{
    userMarkRepository = new UserMarkRepository();

    getMark = async () => {
        const markData = await this.userMarkRepository.findMark();
        return markData
    }

    creatMark = async ({tutorId, userId}) => {
        const markData = await this.userMarkRepository.createMark({tutorId, userId});
        return markData;
    }
    updateMark = async ({userMarkId, tutorId, userId}) =>{
        const markData = await this.userMarkRepository.updateMark({userMarkId, tutorId, userId});
    }
    deleteMark = async ({userMarkId, userId}) => {
        const markData = await this.userMarkRepository.deleteMark({userMarkId, userId});
        return markData;
    }
}
module.exports = UserMarkService;