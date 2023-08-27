const FacechatService = require('../services/facechat.service');

class FacechatController {
    facechatService = new FacechatService();

    createChat = async (req, res) => {
        try {
            const { user_id, tutor_id, facechat_room_id } = req.body;
            const chat = await this.facechatService.createChat(user_id, tutor_id, facechat_room_id);
            res.status(201).send(chat);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    };

    leaveChat = async(req, res) => {
        try {
            const { facechat_id } = req.params;  // ID를 URL 파라미터에서 가져옵니다.
            const chat = await this.facechatService.leaveChat(facechat_id);
            res.status(200).send(chat);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
    
}

module.exports = FacechatController;

