const ReportService = require('../services/report.service');

class ReportController {
    reportService = new ReportService();

    getReport = async (req, res, next) =>{
        try{
  
            res.status(200).json({data: })
        }
        catch(error){
                return res.status(500).json({message: error.message});
        }
    };

    creatReport = async (req, res , next) => {
        try{
   
            res.satus(201).json({data:});
        }
        catch(error){
            return res.status(500).json({message: error.message});
        }
    }
    updateReport = async(req, res, next) => {
        try{
    
            
            res.status(200).json({data:});
        }
        catch(error){
            return res.status(500).json({message: error.message})
        }
    }
    deleteReport = async(req, res,next) => {
        try{
            
            
            res.status(200).json({data: });
        }
        catch(error){
            return res.status(500).json({message:error.message});
        }
    }
}
module.exports = ReportController;