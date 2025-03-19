import Symptom from "../../models/admins/symptom.models.js";

// Create a new symptom
export const createSymptom = async (req, res) => {
  try {
    const { name, possibleConditions } = req.body;

    const symptom = new Symptom({
      name,
      possibleConditions,
    });

    await symptom.save();
    res.status(201).json({ message: "Symptom created successfully", symptom });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating symptom", error: error.message });
  }
};

// Get all symptoms
export const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.find();
    res.status(200).json(symptoms);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching symptoms", error: error.message });
  }
};

// Get symptom by ID
export const getSymptomById = async (req, res) => {
  try {
    const symptom = await Symptom.findById(req.params.id);
    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    res.status(200).json(symptom);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching symptom", error: error.message });
  }
};

// Update symptom
export const updateSymptom = async (req, res) => {
  try {
    const updatedSymptom = await Symptom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedSymptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    res
      .status(200)
      .json({ message: "Symptom updated successfully", updatedSymptom });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating symptom", error: error.message });
  }
};

// Delete symptom
export const deleteSymptom = async (req, res) => {
  try {
    const symptom = await Symptom.findByIdAndDelete(req.params.id);
    if (!symptom) {
      return res.status(404).json({ message: "Symptom not found" });
    }
    res.status(200).json({ message: "Symptom deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting symptom", error: error.message });
  }
};
