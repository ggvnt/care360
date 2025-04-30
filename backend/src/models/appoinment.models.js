import mongoose from "mongoose";

const appoinmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    preferredDoctor : {
        type: String,
        required: true,
    },
    appointmentDateTime: {
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
