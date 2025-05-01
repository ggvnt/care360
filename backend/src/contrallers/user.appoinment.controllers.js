import Doctor from '../models/doctor.models.js';
import Appointment from '../models/appoinment.models.js';

export const getAllAppointments =  async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    console.log("Error fetching appointments:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getAppointment = async (req, res) => {
  const { id } = req.params;
  console.log("user id is :", id);

  try {
    const appointments = await Appointment.find({ userId: id });

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({ success: true, message: "No appointments found." });
    }

    res.status(200).json({
      success: true,
      data: appointments
    });

  } catch (error) {
    console.error("Error in user appointment controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const getDoctors = async (req, res) => {

  try {
    const doctors = await Doctor.find();

    res.status(200).json({ success: true, data: doctors });
  } catch (error) {
    console.error("Error in user appointment controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getAvailableSlots = async (req, res) => {
  const { doctor, date } = req.body; // Use req.body for POST requests

  if (!doctor || !date) {
      return res.status(400).json({ success: false, message: "Doctor and date are required" });
  }

  try {
      // Explicitly set the start time to 5:00 PM (17:00)
      const startTime = new Date(date);
      startTime.setUTCHours(17, 0, 0, 0); // Set hours to 17:00:00.000

      // Generate 5 slots of 20 minutes each
      const slots = Array.from({ length: 5 }, (_, i) => {
          const slotTime = new Date(startTime.getTime() + i * 20 * 60 * 1000);
          return slotTime.toISOString().split("T")[1].slice(0, 5); // Format as HH:mm
      });

      // Fetch booked appointments for the doctor on the given date
      const bookedAppointments = await Appointment.find({ preferredDoctor: doctor, appointmentDate: date });
      const bookedSlots = bookedAppointments.map((appointment) => appointment.timeSlot);

      // Filter out booked slots
      const availableSlots = slots.filter((slot) => !bookedSlots.includes(slot));
      res.status(200).json({ success: true, slots: availableSlots });
  } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createAppointment = async (req, res) => {
  const { preferredDoctor, appointmentDate, timeSlot } = req.body;

  try {
      const existingAppointment = await Appointment.findOne({
          preferredDoctor,
          appointmentDate,
          timeSlot,
      });

      if (existingAppointment) {
          return res.status(400).json({ success: false, message: "Time slot is already booked" });
      }

      const newAppointment = new Appointment(req.body);
      await newAppointment.save();
      res.json({ success: true, message: "Appointment booked successfully!", data: newAppointment });
  } catch (error) {
      res.status(500).json({ success: false, message: "Error booking appointment", error });
  }
};

export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, message: "Appointment updated successfully", data: updatedAppointment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating appointment", error });
  }
};

export const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);
    if (!deletedAppointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }
    res.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting appointment", error });
  }
};



