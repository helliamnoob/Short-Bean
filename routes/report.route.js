const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const ReportController = require('../controllers/report.controller');
const reportController = new ReportController();

router.get('', auth, reportController.getReport);
router.post('', auth, reportController.creatReport);
router.update('', auth, reportController.updateReport);
router.delete('', auth, reportController.deleteReport);

module.exports = router;