import mongoose from "mongoose";

const conditionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  symptoms: [{
    symptom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Symptom',
      required: true
    },
    importance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3
    }
  }],
  recommendedActions: [{
    action: String,
    forSeverity: {
      type: String,
      enum: ['low', 'medium', 'high', 'all'],
      default: 'all'
    }
  }],
  ageGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AgeGroup'
  }],
  sexSpecific: {
    type: String,
    enum: ['male', 'female', null],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Condition = mongoose.model("Condition", conditionSchema);
export default Condition;