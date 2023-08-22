const ReportRepository = require('../repositories/report.repository');

class ReportService{
    reportRepository = new ReportRepository();

    getReport = async ({reportId, userId}) => {
        const reportData = await this.reportRepository.findReport(reportId, userId);
        return reportData
    }

    creatReport = async ({adminId, userId, reportContent, reportUserId, reportstatus}) => {
        const reportData = await this.reportRepository.createReport({adminId, userId, reportContent, reportUserId, reportstatus});
        return reportData;
    }
    updateReport = async ({reportId, userId, reportContent}) =>{
        const reportData = await this.reportRepository.updateReport({reportId, userId, reportContent});
    }
    deleteReport = async ({reportId, userId}) => {
        const reportData = await this.reportRepository.deleteReport({reportId, userId});
        return reportData;
    }
}
module.exports = ReportService;