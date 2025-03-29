import mongoose from "mongoose";

const symptomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Ensures a symptom must have a name
    trim: true, // Removes extra spaces
  },
  possibleConditions: {
    type: [String],
    default: [], // Ensures it's an array even if empty
  },
});

const Symptom = mongoose.model("Symptom", symptomSchema);
export default Symptom;
