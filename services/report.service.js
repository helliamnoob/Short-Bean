const ReportRepository = require('../repositories/report.repository');

class ReportService{
    reportRepository = new ReportRepository();

    getReport = async ({report_id, user_id}) => {
        const reportData = await this.reportRepository.findReport(report_id, user_id);
        return reportData
    }

    creatReport = async ({admin_id, user_id, report_content, reportuser_id, report_status}) => {
        const reportData = await this.reportRepository.createReport({admin_id, user_id, report_content, reportuser_id, report_status});
        return reportData;
    }
    updateReport = async ({report_id, user_id, report_content}) =>{
        const reportData = await this.reportRepository.updateReport({report_id, user_id, report_content});
    }
    deleteReport = async ({report_id, user_id}) => {
        const reportData = await this.reportRepository.deleteReport({report_id, user_id});
        return reportData;
    }
}
module.exports = ReportService;