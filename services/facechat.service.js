const FacechatRepository = require('../repositories/facechat.repository');

class FacechatService {
    facechatRepository = new FacechatRepository();

    createChat = async (user_id, tutor_id, facechat_room_id) => {
        return await this.facechatRepository.createChat(user_id, tutor_id, facechat_room_id);
    };

    leaveChat = async (facechat_id) => {
        return await this.facechatRepository.leaveChat(facechat_id);
    };
}

module.exports = FacechatService;
