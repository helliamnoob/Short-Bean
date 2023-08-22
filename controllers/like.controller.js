const LikeService = require('../services/like.service');

class LikeController {
    likeService = new LikeService();

    getLike = async (req, res, next) =>{
        try{
            const {postId} = req.params;
            const {userId} = res.locals.user;
            const likes = await this.likeService.getLike({postId,userId});

            res.status(200).json({data: likes})
        }
        catch(error){
                return res.status(500).json({message: error.message});
        }
    };

    createLike = async (req, res , next) => {
        try{
            const {postId} = req.params;
            const {userId} = res.locals.user;
            const likes = await this.likeService.createLike({postId,userId});

            res.satus(201).json({data:likes});
        }
        catch(error){
            return res.status(500).json({message:error.message});
        }
    }
    destroyLike = async(req, res,next) => {
        try{
            const {postId} = req.params;
            const {userId} = res.locals.user;

            const likes = await this.likeService.destroyLike({postId,userId});
            
            res.status(200).json({data: likes});
        }
        catch(error){
            return res.status(500).json({message:error.message});
        }
    }
}
module.exports = LikeController;