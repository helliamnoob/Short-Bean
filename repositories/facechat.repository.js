const { FaceChats } = require('../models'); 

class FacechatRepository {
    createChat = async (user_id, tutor_id, facechat_room_id) => {
        return await FaceChats.create({
            user_id,
            tutor_id,
            facechat_room_id,
        });
    };

    leaveChat = async (facechat_id) => {
        return await FaceChats.update(
            { facechat_status: '나가기' },
            { where: { facechat_id } }
        );
    };

    getChat = async (facechat_id) => {
        return await FaceChats.findOne({ where: { facechat_id } });
    }
    
}

module.exports = FacechatRepository;
