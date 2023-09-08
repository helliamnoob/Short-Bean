const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth_middleware');

const TutorController = require('../controllers/tutor.controller');
const tutorController = new TutorController();

router.get('/tutors', tutorController.getAllTutors);
router.get('/tutors/:tutor_id', auth, tutorController.getTutor);
router.post('/tutors', auth, tutorController.creatTutor);
router.put('/tutors/:tutor_id', auth, tutorController.updateTutor);
router.put('/admin/tutors/:tutor_id', auth, tutorController.updateStatus);
router.delete('/tutors/:tutor_id', auth, tutorController.deleteTutor);

module.exports = router;
