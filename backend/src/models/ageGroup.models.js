// models/ageGroup.models.js
import mongoose from "mongoose";

const ageGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  minAgeDays: {
    type: Number,
    required: true
  },
  maxAgeDays: {
    type: Number,
    required: true
  },
  description: {
    type: String
  }
});

const AgeGroup = mongoose.model("AgeGroup", ageGroupSchema);
export default AgeGroup;