import express from "express";
import { checkSymptoms } from "../../contrallers/vishmitha/symptomChecker.controllers.js";

const router = express.Router();

//Route for Symptom Checker
router.post("/symptoms/check", checkSymptoms);

export default router;
