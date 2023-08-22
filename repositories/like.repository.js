const {Like} = require('../models');
const { Op } = require('sequelize');


class LikeRepository {
    createLike = async ({post_id, user_id}) => {
        const likeData = await Like.create({
            post_id,
            user_id,
        });
        return likeData;
    }

    findLike = async ({post_id, user_id}) => {
        const likeData = await Like.findOne({ [Op.and]: [{post_id: post_id}, {user_id: user_id}],},)
        return likeData;
    }

    destoryLike = async ({post_id, user_id}) => {
        const likeData = await Like.findOne({ [Op.and]: [{post_id: post_id}, {user_id: user_id}],},)
        return likeData;
    }

  
    
};

module.exports = LikeRepository;

