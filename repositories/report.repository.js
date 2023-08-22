const {Report} = require('../models');
const { Op } = require('sequelize');


class ReportRepository {
    createReport = async ({adminId, userId, reportContent, reportUserId, reportstatus}) => {
        const reportData = await Report.create({
            adminId,
            userId,
            reportContent,
            reportUserId,
            reportstatus
        });
        return reportData;
    }

    findReport = async ({reportId, userId}) => {
        const reportData = await Report.findAll({  [Op.and]: [{reportId: reportId}, {userId: userId}],
        order: [['cratedAt']],
    })
        return reportData;
    }

    updateReport = async ({reportId, userId, reportContent}) => {
        const reportData = await Report.update({reportContent}, {where: {[Op.and]: [{reportId: reportId}, {userId: userId}]}})
        return reportData;
    }

    deleteReport = async ({reportId, userId}) => {
        const reportData = await Report.findOne({ [Op.and]: [{reportId: reportId}, {userId: userId}],},)
        return reportData;
    }

  
    
};

module.exports = ReportRepository;

