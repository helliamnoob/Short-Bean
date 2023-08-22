const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const UserMarkController = require('../controllers/userMark.controller');
const userMarkController = new UserMarkController();

router.get('', auth, userMarkController.getMark);
router.post('', auth, userMarkController.creatMark);
router.update('', auth, userMarkController.updateMark);
router.delete('', auth, userMarkController.deleteMark);

module.exports = router;