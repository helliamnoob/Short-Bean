const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth_middleware');

const UserMarkController = require('../controllers/userMark.controller');
const userMarkController = new UserMarkController();

router.get('/userMarks/:user_mark_id', auth, userMarkController.getMark);
//router.post('/userMarks/:tutor_id', auth, userMarkController.creatMark);
router.put('/userMarks/:tutor_id', auth, userMarkController.creatMark);
router.delete('/userMarks/:user_mark_id', auth, userMarkController.deleteMark);

module.exports = router;
