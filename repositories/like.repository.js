const {Like} = require('../models');
const { Op } = require('sequelize');


class LikeRepository {
    createLike = async ({postId, userId}) => {
        const likeData = await Like.create({
            postId,
            userId,
        });
        return likeData;
    }

    findLike = async ({postId, userId}) => {
        const likeData = await Like.findOne({ [Op.and]: [{postId: postId}, {userId: userId}],},)
        return likeData;
    }

    destoryLike = async ({postId, userId}) => {
        const likeData = await Like.findOne({ [Op.and]: [{postId: postId}, {userId: userId}],},)
        return likeData;
    }

  
    
};

module.exports = LikeRepository;

