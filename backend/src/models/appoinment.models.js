import mongoose from "mongoose";

const appoinmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    preferredDoctor: {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: String,
        required: true,
    },
    timeSlot: { // New field for time slot
        type: String,
        required: true,
    },
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: String,
      required: true
    }
  },
);

const Appointment = mongoose.model("Appointment", appoinmentSchema);
export default Appointment;