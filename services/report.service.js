const ReportRepository = require('../repositories/report.repository');

class ReportService {
  reportRepository = new ReportRepository();

  getReport = async ({ report_id, user_id }) => {
    const reportData = await this.reportRepository.findReport(report_id, user_id);
    return reportData;
  };
  getReportAll = async () => {
    const reportData = await this.reportRepository.findReportAll();
    return reportData;
  };

  getReportaWeek = async () => {
    const reportData = await this.reportRepository.findaWeek();
    return reportData;
  };
  creatReport = async ({ user_id, report_content, reported_user_id }) => {
    const reportData = await this.reportRepository.createReport({
      user_id,
      report_content,
      reported_user_id,
    });
    return reportData;
  };
  updateReport = async ({ report_id, user_id, report_content }) => {
    const reportData = await this.reportRepository.updateReport({
      report_id,
      user_id,
      report_content,
    });
    return reportData;
  };
  updateStatus = async ({ report_id, report_status }) => {
    const reportData = await this.reportRepository.updateStatus({
      report_id,
      report_status,
    });
    return reportData;
  };
  deleteReport = async ({ report_id, user_id }) => {
    const reportData = await this.reportRepository.deleteReport({ report_id, user_id });
    return reportData;
  };
}
module.exports = ReportService;
