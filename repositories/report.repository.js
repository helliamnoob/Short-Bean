const {Reports} = require('../models');
const { Op } = require('sequelize');


class ReportRepository {
    createReport = async ({user_id, report_content, reported_user_id, report_status}) => {
        const reportData = await Reports.create({
            user_id,
            report_content,
            reported_user_id,
            report_status
        });
        return reportData;
    }

    findReport = async ({report_id, user_id}) => {
        const reportData = await Reports.findAll({  [Op.and]: [{report_id: report_id}, {user_id: user_id}],
        order: [['cratedAt']],
    })
        return reportData;
    }

    updateReport = async ({report_id, user_id, report_content}) => {
        const reportData = await Reports.update({report_content}, {where: {[Op.and]: [{report_id: report_id}, {user_id: user_id}]}})
        return reportData;
    }

    deleteReport = async ({report_id, user_id}) => {
        const reportData = await Reports.findOne({ [Op.and]: [{report_id: report_id}, {user_id: user_id}],},)
        return reportData;
    }

  
    
};

module.exports = ReportRepository;

