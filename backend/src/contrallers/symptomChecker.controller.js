
import Symptom from "../models/Symptom.js";
import AgeGroup from "../models/ageGroup.models.js";
import Condition from "../models/condition.models.js";
import Diagnosis from "../models/Diagnosis.js";
import mongoose from "mongoose";

// Helper function to calculate probability
const calculateConditionProbability = (condition, selectedSymptoms) => {
  const matchingSymptoms = condition.symptoms.filter(cs => 
    selectedSymptoms.includes(cs.symptom.toString())
  );

  if (matchingSymptoms.length === 0) return 0;

  const importanceScore = matchingSymptoms.reduce(
    (sum, cs) => sum + cs.importance, 0
  );

  const maxPossibleScore = condition.symptoms.reduce(
    (sum, cs) => sum + cs.importance, 0
  );

  let probability = Math.min(
    90,
    Math.round((importanceScore / maxPossibleScore) * 100)
  );

  if (matchingSymptoms.length === condition.symptoms.length) {
    probability = Math.min(100, probability + 10);
  }

  return probability;
};

// Get all age groups
export const getAgeGroups = async (req, res) => {
  try {
    const ageGroups = await AgeGroup.find().sort({ minAgeDays: 1 });
    res.status(200).json(ageGroups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching age groups" });
  }
};

// Get symptoms by body part
export const getSymptomsByBodyPart = async (req, res) => {
  try {
    const { bodyPart } = req.params;
    const symptoms = await Symptom.find({ bodyPart });
    res.status(200).json(symptoms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching symptoms" });
  }
};

// Create new diagnosis
export const createDiagnosis = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Authentication required" 
      });
    }

    const userId = req.user._id;
    const { symptoms, ageGroupId, sex } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "At least one symptom is required" 
      });
    }

    if (!ageGroupId || !mongoose.isValidObjectId(ageGroupId)) {
      return res.status(400).json({ 
        success: false,
        message: "Valid ageGroupId is required" 
      });
    }

    if (!['male', 'female', 'other'].includes(sex)) {
      return res.status(400).json({ 
        success: false,
        message: "Valid sex is required (male, female, or other)" 
      });
    }

    const symptomObjectIds = symptoms.map(s => {
      if (mongoose.isValidObjectId(s)) {
        return typeof s === 'string' ? new mongoose.Types.ObjectId(s) : s;
      }
      throw new Error(`Invalid symptom ID: ${s}`);
    });

    const ageGroupExists = await AgeGroup.exists({ _id: ageGroupId });
    if (!ageGroupExists) {
      return res.status(400).json({
        success: false,
        message: "Specified age group not found"
      });
    }

    const conditions = await Condition.find({
      'symptoms.symptom': { $in: symptomObjectIds }
    })
    .populate('symptoms.symptom')
    .populate('ageGroups');

    if (!conditions.length) {
      return res.status(200).json({
        success: true,
        message: "No matching conditions found",
        possibleConditions: []
      });
    }

    const possibleConditions = await Promise.all(
      conditions.map(async (condition) => {
        console.log(`Processing condition: ${condition.name}`);
        
        const matchingSymptomIds = condition.symptoms
          .map(cs => cs.symptom._id.toString())
          .filter(id => symptoms.includes(id));
    
        console.log(`Matching symptoms for ${condition.name}:`, matchingSymptomIds);
    
        if (!matchingSymptomIds.length) {
          console.log(`No matching symptoms for ${condition.name}`);
          return null;
        }
    
        const probability = calculateConditionProbability(condition, matchingSymptomIds);
        console.log(`Probability for ${condition.name}:`, probability);
    
        const ageCompatible = !condition.ageGroups.length || 
          condition.ageGroups.some(ag => ag._id.toString() === ageGroupId.toString());
        console.log(`Age compatible for ${condition.name}:`, ageCompatible);
    
        const sexCompatible = !condition.sexSpecific || 
          condition.sexSpecific === sex;
        console.log(`Sex compatible for ${condition.name}:`, sexCompatible);
    
        if (probability > 0 && ageCompatible && sexCompatible) {
          const result = {
            condition: condition._id,
            conditionName: condition.name,
            probability,
            matchingSymptoms: condition.symptoms
              .filter(cs => matchingSymptomIds.includes(cs.symptom._id.toString()))
              .map(ms => ({
                symptom: ms.symptom._id,
                name: ms.symptom.name,
                importance: ms.importance
              })),
            recommendedActions: condition.recommendedActions
              .filter(ra => ['all', condition.severity].includes(ra.forSeverity))
              .map(ra => ra.action)
          };
          console.log(`Including condition ${condition.name} in results`);
          return result;
        }
        
        console.log(`Excluding condition ${condition.name} due to filters`);
        return null;
      })
    );

    const validConditions = possibleConditions
      .filter(c => c !== null)
      .sort((a, b) => b.probability - a.probability);

    const diagnosis = new Diagnosis({
      user: userId,
      symptoms: symptomObjectIds,
      ageGroup: ageGroupId,
      sex,
      possibleConditions: validConditions,
      createdAt: new Date()
    });

    await diagnosis.save();

    const populatedDiagnosis = await Diagnosis.findById(diagnosis._id)
      .populate('symptoms', 'name description bodyPart')
      .populate('ageGroup', 'name description')
      .populate({
        path: 'possibleConditions.condition',
        select: 'name description severity'
      });

    res.status(201).json({
      success: true,
      diagnosis: populatedDiagnosis
    });

  } catch (error) {
    console.error("Diagnosis creation failed:", error);
    
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({ 
      success: false,
      message: error.message || "Diagnosis creation failed"
    });
  }
};

// Get diagnosis history
export const getDiagnosisHistory = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized" 
      });
    }

    const userId = req.user._id;

    const diagnoses = await Diagnosis.find({ user: userId })
      .populate('symptoms', 'name description bodyPart')
      .populate('ageGroup', 'name description')
      .populate({
        path: 'possibleConditions.condition',
        select: 'name description severity'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: diagnoses.length,
      data: diagnoses
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching diagnosis history"
    });
  }
};

// Get diagnosis details
export const getDiagnosisDetails = async (req, res) => {
  try {
    if (!req.params.id || !mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: "Valid diagnosis ID is required" 
      });
    }

    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized" 
      });
    }

    const { id } = req.params;
    const userId = req.user._id;

    const diagnosis = await Diagnosis.findOne({
      _id: id,
      user: userId
    })
      .populate('symptoms', 'name description bodyPart')
      .populate('ageGroup', 'name description')
      .populate({
        path: 'possibleConditions.condition',
        select: 'name description severity recommendedActions'
      })
      .populate({
        path: 'possibleConditions.matchingSymptoms.symptom',
        select: 'name description'
      });

    if (!diagnosis) {
      return res.status(404).json({ 
        success: false,
        message: "Diagnosis not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: diagnosis
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: "Invalid diagnosis ID format" 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Internal server error"
    });
  }
};

// Get all symptoms reported by a specific user (from their diagnosis history)
export const getUserSymptoms = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - User not authenticated" 
      });
    }

    const userId = req.params.userId || req.user._id;

    // Validate if the requested user is the same as authenticated user (or admin)
    if (userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "Forbidden - You can only access your own symptoms" 
      });
    }

    // Get all diagnoses for the user and populate symptoms
    const diagnoses = await Diagnosis.find({ user: userId })
      .populate('symptoms', 'name description bodyPart')
      .sort({ createdAt: -1 });

    // Extract unique symptoms from all diagnoses
    const allSymptoms = [];
    const uniqueSymptomIds = new Set();

    diagnoses.forEach(diagnosis => {
      diagnosis.symptoms.forEach(symptom => {
        if (!uniqueSymptomIds.has(symptom._id.toString())) {
          uniqueSymptomIds.add(symptom._id.toString());
          allSymptoms.push({
            _id: symptom._id,
            name: symptom.name,
            description: symptom.description,
            bodyPart: symptom.bodyPart,
            firstReported: diagnosis.createdAt,
            lastReported: diagnosis.createdAt // Will be updated if found again
          });
        } else {
          // Update lastReported date if symptom was reported again
          const existingSymptom = allSymptoms.find(s => s._id.toString() === symptom._id.toString());
          if (existingSymptom && existingSymptom.lastReported < diagnosis.createdAt) {
            existingSymptom.lastReported = diagnosis.createdAt;
          }
        }
      });
    });

    res.status(200).json({
      success: true,
      count: allSymptoms.length,
      data: allSymptoms
    });

  } catch (error) {
    console.error("Error fetching user symptoms:", error);
    res.status(500).json({ 
      success: false,
      message: "Error fetching user symptoms",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};