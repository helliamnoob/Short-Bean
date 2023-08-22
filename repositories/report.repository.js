const {Report} = require('../models');
const { Op } = require('sequelize');


class ReportRepository {
    createReport = async ({admin_id, user_id, report_content, report_user_id, report_status}) => {
        const reportData = await Report.create({
            admin_id,
            user_id,
            report_content,
            report_user_id,
            report_status
        });
        return reportData;
    }

    findReport = async ({report_id, user_id}) => {
        const reportData = await Report.findAll({  [Op.and]: [{report_id: report_id}, {user_id: user_id}],
        order: [['cratedAt']],
    })
        return reportData;
    }

    updateReport = async ({report_id, user_id, report_content}) => {
        const reportData = await Report.update({report_content}, {where: {[Op.and]: [{report_id: report_id}, {user_id: user_id}]}})
        return reportData;
    }

    deleteReport = async ({report_id, user_id}) => {
        const reportData = await Report.findOne({ [Op.and]: [{report_id: report_id}, {user_id: user_id}],},)
        return reportData;
    }

  
    
};

module.exports = ReportRepository;

