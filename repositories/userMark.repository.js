const {UserMark} = require('../models');
const { Op } = require('sequelize');


class UserMarkRepository {
    createMark = async ({tutorId, userId}) => {
        const markData = await UserMark.create({
            tutorId,
            userId,
        });
        return markData;
    }

    findMark = async (userId) => {
        const markData = await UserMark.findAll({ where: {userId: userId},
        order: [['cratedAt']],
    })
        return markData;
    }

    updateMark = async ({userMarkId, tutorId, userId}) => {
        const markData = await UserMark.update({tutorId}, {where: {[Op.and]: [{userMarkId: userMarkId}, {userId: userId}]}})
        return markData;
    }

    deleteMark = async ({userMarkId, userId}) => {
        const markData = await UserMark.findOne({ [Op.and]: [{userMarkId: userMarkId}, {userId: userId}],},)
        return markData;
    }

  
    
};

module.exports = UserMarkRepository;

