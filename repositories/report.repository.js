const { Reports } = require('../models');
const { Op } = require('sequelize');

class ReportRepository {
  createReport = async ({ user_id, report_content, reported_user_id }) => {
    const reportData = await Reports.create({
      user_id,
      report_content,
      reported_user_id,
    });
    return reportData;
  };

  findReport = async ({ report_id, user_id }) => {
    const reportData = await Reports.findOne({
      [Op.and]: [{ report_id: report_id }, { user_id: user_id }],
      order: [['createdAt']],
    });
    return reportData;
  };

  updateReport = async ({ report_id, user_id, report_content }) => {
    const reportData = await Reports.update(
      { report_content },
      { where: { [Op.and]: [{ report_id: report_id }, { user_id: user_id }] } }
    );
    return reportData;
  };

  deleteReport = async ({ report_id, user_id }) => {
    const reportData = await Reports.delete({
      [Op.and]: [{ report_id: report_id }, { user_id: user_id }],
    });
    return reportData;
  };
}

module.exports = ReportRepository;
