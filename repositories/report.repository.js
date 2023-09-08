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
  findReportAll = async () => {
    const reportData = await Reports.findAll();
    return reportData;
  };

  findaWeek = async () => {
    const reportData = await Reports.findAll({
      where: { [Op.gte]: new Date(Date.parse(new Date()) - 7 * 1000 * 60 * 60 * 24) },
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

  updateStatus = async ({ report_id, report_status }) => {
    const reportData = await Reports.update({ report_status }, { where: { report_id: report_id } });
    return reportData;
  };

  deleteReport = async ({ report_id, user_id }) => {
    const reportData = await Reports.destroy({
      where: {
        [Op.and]: [{ report_id: report_id }, { user_id: user_id }],
      },
    });
    return reportData;
  };
}

module.exports = ReportRepository;
