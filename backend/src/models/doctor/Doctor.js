import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  fullName: {
    type: String
  },
  email: {
    type: String
  },
  specialization: {
    type: String
  },
  qualifications: {
    type: [String]
  },
  experience: {
    type: Number
  },
  consultationFee: {
    type: Number
  },
  phone: {
    type: String
  },
  address: {
    type: String
  },
  availability: {
    type: String
  }
}, {
  timestamps: true
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;