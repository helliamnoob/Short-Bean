const UserMarkService = require('../services/like.service');

class UserMarkController {
    userMarkService = new UserMarkService();

    getMark = async (req, res, next) =>{
        try{
            const {user_id} = res.locals.user;
            const marks = await this.markService.getMark(user_id);

            res.status(200).json({data: marks})
        }
        catch(error){
                return res.status(500).json({message: error.message});
        }
    };

    creatMark = async (req, res , next) => {
        try{
            const {tutor_id} = req.params;
            const {user_id} = res.locals.user;
            const marks = await this.markService.createLike({tutor_id,user_id});

            res.satus(201).json({data:marks});
        }
        catch(error){
            return res.status(500).json({message: error.message});
        }
    }
    updateMark = async(req, res, next) => {
        try{
            const {user_mark_id, tutor_id} = req.params;
            const {user_id} = res.locals.user;
            const marks = await this.markService.updateMark({user_mark_id, tutor_id, user_id});
            
            res.status(200).json({data:marks});
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
    deleteMark = async(req, res,next) => {
        try{
            const {user_mark_id} = req.params;
            const {user_id} = res.locals.user;

            const marks = await this.markService.deleteMark({user_mark_id,user_id});
            
            res.status(200).json({data: marks});
        }
        catch(error){
            return res.status(500).json({message:error.message});
        }
    }
}
module.exports = UserMarkController;