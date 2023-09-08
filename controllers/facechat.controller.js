const FacechatService = require('../services/facechat.service');

class FacechatController {
    facechatService = new FacechatService();

    createChat = async (req, res) => {
        try {
            const { user_id, target_user_id, facechat_room_id} = req.body;
            const chat = await this.facechatService.createChat( user_id, target_user_id,facechat_room_id);
            res.status(201).send(chat);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    };

    leaveChat = async(req, res) => {
        try {
            const { facechat_id } = req.params; 
            const chat = await this.facechatService.leaveChat(facechat_id);
            res.status(200).send(chat);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }

    getChat = async(req, res) => {
        try {
            const { facechat_id } = req.params;
            const chat = await this.facechatService.getChat(facechat_id);
            if (chat) {
                res.status(200).send(chat);
            } else {
                res.status(404).send({ message: "채팅방을 찾을 수 없습니다." });
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
    
    
}

module.exports = FacechatController;

