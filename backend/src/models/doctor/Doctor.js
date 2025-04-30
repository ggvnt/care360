import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  qualifications: {
    type: [String],
    required: true,
  },
  experience: {
    type: Number, // In years
    required: true,
    min: 0,
  },
  consultationFee: {
    type: Number,
    required: true,
    min: 0,
  },
  contactInfo: {
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  availability: {
    type: String,
    required: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;