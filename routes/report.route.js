const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth_middleware');

const ReportController = require('../controllers/report.controller');
const reportController = new ReportController();

router.get('/reports/:report_id', auth, reportController.getReport);
router.post('/reports', auth, reportController.creatReport);
router.put('/reports/:report_id', auth, reportController.updateReport);
router.delete('/reports/:report_id', auth, reportController.deleteReport);

module.exports = router;
