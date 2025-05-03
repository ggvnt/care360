import mongoose from "mongoose";

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
  ageGroup: {
    type: mongoose.Schema.ObjectId,
    ref: 'AgeGroup',
    required: true
  },
  sex: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  possibleConditions: [{
    condition: {
      type: mongoose.Schema.ObjectId,
      ref: 'Condition',
      required: true
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    matchingSymptoms: [{
      symptom: {
        type: mongoose.Schema.ObjectId,
        ref: 'Symptom'
      },
      importance: Number
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);
export default Diagnosis;