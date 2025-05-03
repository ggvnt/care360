// import express from 'express';

// import { adminOnly, protectRoute } from '../../middleware/auth.middleware.js';
// import { createSymptom, deleteSymptom, getAllSymptoms, getSymptom, suggestDiagnosis, updateSymptom } from '../../contrallers/symptomController.js';



// const router = express.Router();

// // Public routes
// router.get('/', getAllSymptoms);
// router.get('/:id', getSymptom);
// router.post('/diagnose', suggestDiagnosis);

// // Protected routes
// router.use(protectRoute);
// router.post('/', adminOnly, createSymptom);
// router.patch('/:id', adminOnly, updateSymptom);
// router.delete('/:id', adminOnly, deleteSymptom);

// export default router;
