const ReportService = require('../services/report.service');

class ReportController {
    reportService = new ReportService();

    getReport = async (req, res, next) =>{
        try{
            const {userId} = res.locals.user;
            const {reportId} = req.params;
            const report = await this.reportService.getReport(reportId, userId);
            res.status(200).json({data: report})
        }
        catch(error){
                return res.status(500).json({message: error.message});
        }
    };

    creatReport = async (req, res , next) => {
        try{
            const {userId} = res.locals.user;
            const {adminId} = req.params;
            const {reportContent, reportUserId, reportstatus} = req.body;
            const report = await this.reportService.creatReport(adminId, userId, reportContent, reportUserId, reportstatus)
            res.satus(201).json({data:report});
        }
        catch(error){
            return res.status(500).json({message: error.message});
        }
    }
    updateReport = async(req, res, next) => {
        try{
            const {userId} = res.locals.user;
            const {adminId} = req.params;
            const {reportContent} = req.body;
            const report = await this.reportService.getReport(adminId, userId, reportContent);

            res.status(200).json({data:report});
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
    deleteReport = async(req, res,next) => {
        try{
            const {userId} = res.locals.user;
            const {reportId} = req.params;
            const report = await this.reportService.deleteReport(reportId, userId, reportContent);
            res.status(200).json({data: report});
        }
        catch(error){
            return res.status(500).json({message:error.message});
        }
    }
}
module.exports = ReportController;