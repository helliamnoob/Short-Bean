const LikeRepository = require('../repositories/like.repository');

class LikeService{
    likeRepository = new LikeRepository();

    getLike = async (post_id) => {
        const getLikeData = await this.likeRepository.findLike(post_id);
        return getLikeData
    }

    createLike = async ({post_id, user_id}) => {
        const likeData = await this.likeRepository.createLike({post_id, user_id});
        return likeData;
    }

    destroyLike = async ({post_id, user_id}) => {
        const likeData = await this.likeRepository.destoryLike({post_id, user_id});
        return likeData;
    }
}
module.exports = LikeService;