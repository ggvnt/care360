import mongoose from "mongoose";

const appoinmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    doctorId : {
        type: String,
        required: true,
    },
    appointmentDate: {
        type: String,
        required: true,
    },
    appointmentTime: {
        type: String,
        required: true,
    }
  },
);

const Appointment = mongoose.model("Appointment", appoinmentSchema);
export default Appointment;
