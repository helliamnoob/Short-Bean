const ReportService = require('../services/report.service');

class ReportController {
    reportService = new ReportService();

    getReport = async (req, res, next) =>{
        try{
            const {user_id} = res.locals.user;
            const {report_id} = req.params;
            const report = await this.reportService.getReport(report_id, user_id);
            res.status(200).json({data: report})
        }
        catch(error){
                return res.status(500).json({message: error.message});
        }
    };

    creatReport = async (req, res , next) => {
        try{
            const {user_id} = res.locals.user;
            const {admin_id} = req.params;
            const {report_content, report_user_id, report_status} = req.body;
            const report = await this.reportService.creatReport(admin_id, user_id, report_content, report_user_id, report_status)
            res.satus(201).json({data:report});
        }
        catch(error){
            return res.status(500).json({message: error.message});
        }
    }
    updateReport = async(req, res, next) => {
        try{
            const {user_id} = res.locals.user;
            const {admin_id} = req.params;
            const {report_content} = req.body;
            const report = await this.reportService.getReport(admin_id, user_id, report_content);

            res.status(200).json({data:report});
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
    deleteReport = async(req, res,next) => {
        try{
            const {user_id} = res.locals.user;
            const {report_id} = req.params;
            const report = await this.reportService.deleteReport(report_id, user_id);
            res.status(200).json({data: report});
        }
        catch(error){
            return res.status(500).json({message:error.message});
        }
    }
}
module.exports = ReportController;