import Symptom from "../models/Symptom.js";
import mongoose from "mongoose";

const symptoms = [
  {
    name: "Fever",
    description: "Elevated body temperature above 38°C (100.4°F)",
    bodyPart: "general",
    severity: "high"
  },
  {
    name: "Cough",
    description: "Expulsion of air from lungs with sudden sharp sound",
    bodyPart: "chest",
    severity: "medium"
  },
  {
    name: "Headache",
    description: "Pain in any region of the head",
    bodyPart: "head",
    severity: "medium"
  },
  {
    name: "Sore Throat",
    description: "Pain, scratchiness or irritation of the throat",
    bodyPart: "neck",
    severity: "medium"
  },
  {
    name: "Shortness of Breath",
    description: "Difficulty breathing or feeling breathless",
    bodyPart: "chest",
    severity: "high"
  },
  {
    name: "Chest Pain",
    description: "Pain or discomfort in the chest area",
    bodyPart: "chest",
    severity: "high"
  },
  {
    name: "Fatigue",
    description: "Persistent feeling of tiredness or weakness",
    bodyPart: "general",
    severity: "medium"
  },
  {
    name: "Nausea",
    description: "Feeling of sickness with an inclination to vomit",
    bodyPart: "abdomen",
    severity: "medium"
  },
  {
    name: "Dizziness",
    description: "Sensation of spinning or lightheadedness",
    bodyPart: "head",
    severity: "medium"
  },
  {
    name: "Rash",
    description: "Change in skin appearance or texture",
    bodyPart: "skin",
    severity: "low"
  }
];

const seedSymptoms = async () => {
  try {
    console.log("Seeding symptoms...");
    await Symptom.deleteMany();
    await Symptom.insertMany(symptoms);
    console.log("Symptoms seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding symptoms:", error);
    return false;
  }
};

export default seedSymptoms;