import Symptom from "../../models/admins/symptom.models.js";

// Symptom Checker API
export const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      console.log("No symptoms received");
      return res.status(400).json({ message: "Please provide symptoms" });
    }

    console.log("Received Symptoms:", symptoms);

    // Find matching symptoms in the database
    const matchedSymptoms = await Symptom.find({
      name: { $in: symptoms },
    });

    console.log("Matched Symptoms:", matchedSymptoms);

    if (matchedSymptoms.length === 0) {
      console.log("No matching symptoms found in database");
      return res.status(404).json({ message: "No matching symptoms found" });
    }

    // Collect possible conditions from matched symptoms
    let possibleConditions = new Set();
    matchedSymptoms.forEach((symptom) => {
      symptom.possibleConditions.forEach((condition) =>
        possibleConditions.add(condition)
      );
    });

    console.log("Possible Conditions:", Array.from(possibleConditions));

    // Return the response
    return res.json({ possibleConditions: Array.from(possibleConditions) });
  } catch (error) {
    console.error("Error in Symptom Checker:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
