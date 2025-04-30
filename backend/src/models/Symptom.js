import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a symptom name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  bodyPart: {
    type: String,
    required: [true, 'Please specify body part'],
    enum: [
      'head', 'neck', 'chest', 'abdomen', 'back', 'pelvis', 
      'arms', 'legs', 'skin', 'general', 'other'
    ]
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  associatedSymptoms: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Symptom'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Symptom = mongoose.model("Symptom", symptomSchema);
export default Symptom;