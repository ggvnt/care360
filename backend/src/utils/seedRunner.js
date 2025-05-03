// utils/seedRunner.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedAgeGroups from "./seedAgeGroups.js";
import seedSymptoms from "./seedSymptoms.js";
import seedConditions from "./seedConditions.js";

dotenv.config();

const runSeeds = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB");

    // Run seeds in proper order
    await seedAgeGroups();
    await seedSymptoms();
    await seedConditions();

    console.log("All seeds completed successfully");
  } catch (error) {
    console.error("Error running seeds:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

runSeeds();