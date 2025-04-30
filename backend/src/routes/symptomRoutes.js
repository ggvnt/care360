const express = require('express');
const symptomController = require('../controllers/symptomController');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes
router.get('/', symptomController.getAllSymptoms);
router.get('/:id', symptomController.getSymptom);

// Protected routes (require authentication)
router.use(authController.protect);

router.post('/', authController.restrictTo('admin'), symptomController.createSymptom);
router.patch('/:id', authController.restrictTo('admin'), symptomController.updateSymptom);
router.delete('/:id', authController.restrictTo('admin'), symptomController.deleteSymptom);

// Diagnosis endpoint
router.post('/diagnose', symptomController.suggestDiagnosis);

module.exports = router;