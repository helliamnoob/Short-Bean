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
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 현재 시간에서 7일 이전 시간 계산
    const reportData = await Reports.findAll({
      where: {
        createdAt: {
          [Op.gte]: oneWeekAgo,
        },
      },
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
