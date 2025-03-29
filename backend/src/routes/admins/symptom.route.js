import express from "express";
import {
  createSymptom,
  deleteSymptom,
  getSymptomById,
  getSymptoms,
  updateSymptom,
} from "../../contrallers/admin/symptom.contrallers.js";

const router = express.Router();

// Routes for Symptoms
router.post("/symptoms/add", createSymptom); // Create a new symptom
router.get("/symptoms", getSymptoms); // Get all symptoms
router.get("/:id", getSymptomById); // Get a symptom by ID
router.put("/:id", updateSymptom); // Update a symptom
router.delete("/symptoms/:id", deleteSymptom); // Delete a symptom

export default router;
