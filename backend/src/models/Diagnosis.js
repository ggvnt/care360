const mongoose = require('mongoose');

const diagnosisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  symptoms: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Symptom',
    required: true
  }],
  possibleConditions: [{
    condition: {
      type: String,
      required: true
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    description: String,
    recommendedActions: [String]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Diagnosis', diagnosisSchema);