const LikeRepository = require('../repositories/like.repository');

class LikeService{
    likeRepository = new LikeRepository();

    getLike = async (postId) => {
        const getLikeData = await this.likeRepository.findLike(postId);
        return getLikeData
    }

    createLike = async ({postId, userId}) => {
        const likeData = await this.likeRepository.createLike({postId, userId});
        return likeData;
    }

    destroyLike = async ({postId, userId}) => {
        const likeData = await this.likeRepository.destoryLike({postId, userId});
        return likeData;
    }
}
module.exports = LikeService;