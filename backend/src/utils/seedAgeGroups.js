import AgeGroup from "../models/ageGroup.models.js";
import mongoose from "mongoose";

const ageGroups = [
  { name: "Newborn", minAgeDays: 0, maxAgeDays: 28, description: "0-28 days" },
  { name: "Infant", minAgeDays: 29, maxAgeDays: 365, description: "29 days to 1 year" },
  { name: "Toddler", minAgeDays: 366, maxAgeDays: 1095, description: "1-3 years" },
  { name: "Preschool", minAgeDays: 1096, maxAgeDays: 1825, description: "3-5 years" },
  { name: "Child", minAgeDays: 1826, maxAgeDays: 4745, description: "5-13 years" },
  { name: "Adolescent", minAgeDays: 4746, maxAgeDays: 6205, description: "13-17 years" },
  { name: "Adult", minAgeDays: 6206, maxAgeDays: 25550, description: "18-70 years" },
  { name: "Senior", minAgeDays: 25551, maxAgeDays: 36500, description: "70+ years" }
];

const seedAgeGroups = async () => {
  try {
    console.log("Seeding age groups...");
    await AgeGroup.deleteMany();
    await AgeGroup.insertMany(ageGroups);
    console.log("Age groups seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding age groups:", error);
    return false;
  }
};

export default seedAgeGroups;