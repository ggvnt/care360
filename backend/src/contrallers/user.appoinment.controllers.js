import Doctor from '../models/doctor.models.js';
import Appointment  from '../models/appoinment.models.js';

export const getAppointment = async (req, res) => {
     const userId = req.user._id;
     console.log(userId);
      

    try {
      const appointments = await Appointment.find({ userId });

      if (!appointments) {
        return res.status(200).json({ success: true, message: "No appointments found." });
      }
  
        res.status(200).json({ success: true, data: appointments });
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

export const createAppointment = async (req, res) => {
    console.log(req.body);
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.json({ success: true, message: "Appointment booked successfully!", data: newAppointment });
      } catch (error) {
        res.status(500).json({ success: false, message: "Error booking appointment", error });
      }
}

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



