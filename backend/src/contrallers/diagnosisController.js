// diagnosisController.js
import Symptom from '../models/Symptom.js';
import AppError from '../utils/appError.js';

export const diagnosticAlgorithm = async (symptoms) => {
  try {
    const symptomNames = symptoms.map(s => s.name.toLowerCase());

    const conditions = [];

    if (symptomNames.includes('fever') && symptomNames.includes('cough')) {
      conditions.push({
        condition: 'Common Cold',
        probability: 60,
        description: 'Viral infection of the upper respiratory tract',
        recommendedActions: ['Rest', 'Stay hydrated', 'Over-the-counter pain relievers']
      });

      conditions.push({
        condition: 'Influenza (Flu)',
        probability: 30,
        description: 'Viral infection affecting the respiratory system',
        recommendedActions: ['Rest', 'Fluids', 'Antiviral medications if early']
      });
    }

    if (symptomNames.includes('chest pain') && symptomNames.includes('shortness of breath')) {
      conditions.push({
        condition: 'Heart Attack',
        probability: 20,
        description: 'Medical emergency requiring immediate attention',
        recommendedActions: ['Call emergency services immediately']
      });
    }

    conditions.sort((a, b) => b.probability - a.probability);

    return conditions;

  } catch (err) {
    console.error('Diagnostic error:', err);
    throw new AppError('Diagnosis failed', 500);
  }
};
