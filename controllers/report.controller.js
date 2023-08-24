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
            const {report_content, reported_user_id, report_status} = req.body;
            const {user_id} = res.locals.user;

            console.log(user_id, report_content,
                reported_user_id,
                report_status);

            const report = await this.reportService.creatReport({user_id, report_content, reported_user_id, report_status})
            res.status(201).json({data:report});
           
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
    deleteReport = async(req, res, next) => {
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