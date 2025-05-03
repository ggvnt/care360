import express from "express";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { createDiagnosis, getAgeGroups, getDiagnosisDetails, getDiagnosisHistory, getSymptomsByBodyPart } from "../contrallers/symptomChecker.controller.js";

const router = express.Router();

// Public routes
router.get("/age-groups", getAgeGroups);
router.get("/symptoms/:bodyPart", getSymptomsByBodyPart);

// Protected routes
router.post("/diagnosis", protectRoute, createDiagnosis);
router.get("/diagnosis/history", protectRoute, getDiagnosisHistory);
router.get("/diagnosis/:id", protectRoute, getDiagnosisDetails);
// router.get("/user/:userId/symptoms", protectRoute, adminOnly, getUserSymptoms);


export default router;