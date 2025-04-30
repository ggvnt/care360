const Symptom = require('../models/Symptom');
const axios = require('axios');

// This is a simplified version - you might want to integrate with a medical API
exports.diagnosticAlgorithm = async (symptoms) => {
  try {
    // Option 1: Use a medical API (like Infermedica or API Medic)
    // const response = await axios.post('https://api.infermedica.com/v3/diagnosis', {
    //   sex: "male",
    //   age: 30,
    //   evidence: symptoms.map(s => ({ id: s.apiId, choice_id: "present" }))
    // });
    // return response.data.conditions;

    // Option 2: Local knowledge base (simplified example)
    const symptomNames = symptoms.map(s => s.name.toLowerCase());
    
    const conditions = [];
    
    // Example simple rules
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
    
    // Sort by probability
    conditions.sort((a, b) => b.probability - a.probability);
    
    return conditions;
    
  } catch (err) {
    console.error('Diagnostic error:', err);
    throw err;
  }
};