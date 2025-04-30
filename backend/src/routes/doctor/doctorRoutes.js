import express from "express";
import Doctor from "../../models/doctor/Doctor.js";

const router = express.Router();

// Create a new doctor
router.post("/", async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      specialization, 
      qualifications, 
      experience, 
      consultationFee, 
      contactInfo, 
      availability 
    } = req.body;

    // Check if the doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // Create a new doctor
    const newDoctor = new Doctor({ 
      fullName, 
      email, 
      specialization, 
      qualifications, 
      experience, 
      consultationFee, 
      contactInfo, 
      availability 
    });
    await newDoctor.save();

    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get a single doctor by ID
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a doctor by ID
router.put("/:id", async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      specialization, 
      qualifications, 
      experience, 
      consultationFee, 
      contactInfo, 
      availability 
    } = req.body;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { 
        fullName, 
        email, 
        specialization, 
        qualifications, 
        experience, 
        consultationFee, 
        contactInfo, 
        availability 
      },
      { new: true } // Return the updated document
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json(updatedDoctor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a doctor by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedDoctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;