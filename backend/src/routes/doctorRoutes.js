import express from "express";
import Doctor from "../models/doctor.models.js";

const router = express.Router();

// Create a new doctor
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      qualifications,
      experience,
      consultationFee,
      phone,
      address,
      availability,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !specialization ||
      !qualifications ||
      !experience ||
      !consultationFee ||
      !phone ||
      !address ||
      !availability
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the doctor already exists
    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res
        .status(400)
        .json({ message: "Doctor with this email already exists" });
    }

    // Create new doctor
    const newDoctor = new Doctor({
      name,
      email,
      specialization,
      qualifications: qualifications.filter((q) => q.trim() !== ""),
      experience: Number(experience),
      consultationFee: Number(consultationFee),
      phone,
      address,
      availability,
    });

    await newDoctor.save();

    res.status(201).json({
      message: "Doctor added successfully",
      doctor: newDoctor,
    });
  } catch (err) {
    console.error("Error creating doctor:", err);
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
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
    console.error("Error fetching doctor:", err);
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
      phone,
      address,
      availability,
    } = req.body;

    // Validate that at least one field is provided for update
    if (
      !fullName &&
      !email &&
      !specialization &&
      !qualifications &&
      !experience &&
      !consultationFee &&
      !phone &&
      !address &&
      !availability
    ) {
      return res
        .status(400)
        .json({ message: "At least one field must be provided for update" });
    }

    // Prepare update object
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;
    if (specialization) updateData.specialization = specialization;
    if (qualifications)
      updateData.qualifications = qualifications.filter((q) => q.trim() !== "");
    if (experience) updateData.experience = Number(experience);
    if (consultationFee) updateData.consultationFee = Number(consultationFee);
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (availability) updateData.availability = availability;

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true } // Return updated document and run schema validators
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({
      message: "Doctor updated successfully",
      doctor: updatedDoctor,
    });
  } catch (err) {
    console.error("Error updating doctor:", err);
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((error) => error.message);
      return res.status(400).json({ message: "Validation error", errors });
    }
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
    console.error("Error deleting doctor:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;