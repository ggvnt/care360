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

export const checkSymptomsAI = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ message: "Please provide symptoms" });
    }

    const response = await axios.post(
      "https://api.infermedica.com/v3/diagnosis",
      {
        sex: "male", // This can be dynamically set by the user
        age: 25, // This can be dynamically set by the user
        evidence: symptoms.map((symptom) => ({
          id: symptom, // The symptom IDs from your database
          choice_id: "present",
        })),
      },
      {
        headers: {
          "App-Id": "YOUR_APP_ID", // Your Infermedica API key
          "App-Key": "YOUR_APP_KEY", // Your Infermedica API key
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error in AI diagnosis:", error);
    res
      .status(500)
      .json({ message: "Error fetching AI-based diagnosis", error });
  }
};
