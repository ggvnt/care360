import mongoose from "mongoose";
import Condition from "../models/condition.models.js";
import Symptom from "../models/Symptom.js";
import AgeGroup from "../models/ageGroup.models.js";

const seedConditions = async () => {
  try {
    console.log("Seeding conditions...");
    await Condition.deleteMany();

    // Get required references
    const [
      fever, cough, headache, soreThroat, 
      shortnessOfBreath, chestPain, fatigue,
      nausea, dizziness, rash
    ] = await Promise.all([
      Symptom.findOne({ name: "Fever" }),
      Symptom.findOne({ name: "Cough" }),
      Symptom.findOne({ name: "Headache" }),
      Symptom.findOne({ name: "Sore Throat" }),
      Symptom.findOne({ name: "Shortness of Breath" }),
      Symptom.findOne({ name: "Chest Pain" }),
      Symptom.findOne({ name: "Fatigue" }),
      Symptom.findOne({ name: "Nausea" }),
      Symptom.findOne({ name: "Dizziness" }),
      Symptom.findOne({ name: "Rash" })
    ]);
    
    const [
      newborn, infant, toddler, preschool,
      child, adolescent, adult, senior
    ] = await Promise.all([
      AgeGroup.findOne({ name: "Newborn" }),
      AgeGroup.findOne({ name: "Infant" }),
      AgeGroup.findOne({ name: "Toddler" }),
      AgeGroup.findOne({ name: "Preschool" }),
      AgeGroup.findOne({ name: "Child" }),
      AgeGroup.findOne({ name: "Adolescent" }),
      AgeGroup.findOne({ name: "Adult" }),
      AgeGroup.findOne({ name: "Senior" })
    ]);

    const conditions = [
      {
        name: "Common Cold",
        description: "Viral infection of the upper respiratory tract",
        severity: "low",
        symptoms: [
          { symptom: cough._id, importance: 3 },
          { symptom: soreThroat._id, importance: 2 },
          { symptom: headache._id, importance: 1 },
          { symptom: fatigue._id, importance: 1 }
        ],
        recommendedActions: [
          { action: "Rest and hydration", forSeverity: "all" },
          { action: "Over-the-counter pain relievers", forSeverity: "all" },
          { action: "Consult doctor if symptoms persist beyond 10 days", forSeverity: "medium" }
        ],
        ageGroups: [adult._id, child._id, adolescent._id]
      },
      {
        name: "Influenza (Flu)",
        description: "Viral infection affecting the respiratory system",
        severity: "high",
        symptoms: [
          { symptom: fever._id, importance: 5 },
          { symptom: cough._id, importance: 4 },
          { symptom: headache._id, importance: 3 },
          { symptom: fatigue._id, importance: 4 },
          { symptom: soreThroat._id, importance: 2 }
        ],
        recommendedActions: [
          { action: "Antiviral medication (if early)", forSeverity: "high" },
          { action: "Rest and fluids", forSeverity: "all" },
          { action: "Seek medical attention if severe", forSeverity: "high" }
        ],
        ageGroups: [adult._id, child._id, adolescent._id]
      },
      {
        name: "Strep Throat",
        description: "Bacterial infection causing throat pain",
        severity: "medium",
        symptoms: [
          { symptom: soreThroat._id, importance: 5 },
          { symptom: fever._id, importance: 4 },
          { symptom: headache._id, importance: 2 }
        ],
        recommendedActions: [
          { action: "Antibiotics (requires prescription)", forSeverity: "medium" },
          { action: "Throat lozenges", forSeverity: "all" },
          { action: "Warm salt water gargles", forSeverity: "all" }
        ],
        ageGroups: [child._id, adolescent._id] // More common in children/teens
      },
      {
        name: "Pneumonia",
        description: "Infection that inflames air sacs in one or both lungs",
        severity: "high",
        symptoms: [
          { symptom: cough._id, importance: 4 },
          { symptom: fever._id, importance: 4 },
          { symptom: shortnessOfBreath._id, importance: 5 },
          { symptom: chestPain._id, importance: 3 },
          { symptom: fatigue._id, importance: 3 }
        ],
        recommendedActions: [
          { action: "Seek immediate medical attention", forSeverity: "high" },
          { action: "Antibiotics (if bacterial)", forSeverity: "high" },
          { action: "Hospitalization may be required", forSeverity: "high" }
        ],
        ageGroups: [adult._id, child._id, senior._id, infant._id]
      },
      {
        name: "Migraine",
        description: "Recurrent headache disorder",
        severity: "medium",
        symptoms: [
          { symptom: headache._id, importance: 5 },
          { symptom: nausea._id, importance: 3 },
          { symptom: dizziness._id, importance: 2 }
        ],
        recommendedActions: [
          { action: "Rest in a quiet, dark room", forSeverity: "all" },
          { action: "Prescription migraine medication", forSeverity: "medium" },
          { action: "Hydration and regular meals", forSeverity: "all" }
        ],
        ageGroups: [adult._id, adolescent._id]
      },
      {
        name: "Allergic Reaction",
        description: "Immune system response to allergens",
        severity: "medium",
        symptoms: [
          { symptom: rash._id, importance: 4 },
          { symptom: shortnessOfBreath._id, importance: 3 },
          { symptom: dizziness._id, importance: 2 }
        ],
        recommendedActions: [
          { action: "Antihistamines", forSeverity: "all" },
          { action: "Epinephrine for severe reactions", forSeverity: "high" },
          { action: "Avoid known allergens", forSeverity: "all" }
        ],
        ageGroups: [adult._id, child._id, adolescent._id, infant._id]
      }
    ];

    await Condition.insertMany(conditions);
    console.log("Conditions seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding conditions:", error);
    return false;
  }
};

export default seedConditions;