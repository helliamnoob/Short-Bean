const UserMarkService = require('../services/like.service');

class UserMarkController {
    userMarkService = new UserMarkService();

    getMark = async (req, res, next) =>{
        try{
            const {userId} = res.locals.user;
            const marks = await this.markService.getMark(userId);

            res.status(200).json({data: marks})
        }
        catch(error){
                return res.status(500).json({message: error.message});
        }
    };

    creatMark = async (req, res , next) => {
        try{
            const {tutorId} = req.params;
            const {userId} = res.locals.user;
            const marks = await this.markService.createLike({tutorId,userId});

            res.satus(201).json({data:marks});
        }
        catch(error){
            return res.status(500).json({message: error.message});
        }
    }
    updateMark = async(req, res, next) => {
        try{
            const {userMarId, tutorId} = req.params;
            const {userId} = res.locals.user;
            const marks = await this.markService.updateMark({userMarkId, tutorId, userId});
            
            res.status(200).json({data:marks});
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
    deleteMark = async(req, res,next) => {
        try{
            const {userMarkId} = req.params;
            const {userId} = res.locals.user;

            const marks = await this.markService.deleteMark({userMarkId,userId});
            
            res.status(200).json({data: marks});
        }
        catch(error){
            return res.status(500).json({message:error.message});
        }
    }
}
module.exports = UserMarkController;