import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { axiosInstance } from "../../lib/axios";

const ReviewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch all appointments when the component loads
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/my/appointments");
        // Safeguard to ensure response.data exists
        const fetchedAppointments = response?.data || [];
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="inline-flex px-10 py-2 bg-white shadow">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/admin/dashboard")} // Navigate back to AdminPage
        >
          Back
        </button>
        <h1 className="text-2xl font-bold mx-auto">All Appointments</h1>
      </div>
      <div className="overflow-x-auto mx-10 mt-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">Full Name</th>
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Gender</th>
              <th className="border border-gray-300 px-4 py-2">Contact Number</th>
              <th className="border border-gray-300 px-4 py-2">Date of Birth</th>
              <th className="border border-gray-300 px-4 py-2">Preferred Doctor</th>
              <th className="border border-gray-300 px-4 py-2">Appointment Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <tr key={appointment._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{appointment.fullName}</td>
                  <td className="border border-gray-300 px-4 py-2">{appointment.email}</td>
                  <td className="border border-gray-300 px-4 py-2">{appointment.gender}</td>
                  <td className="border border-gray-300 px-4 py-2">{appointment.contactNumber}</td>
                  <td className="border border-gray-300 px-4 py-2">{appointment.dateOfBirth}</td>
                  <td className="border border-gray-300 px-4 py-2">{appointment.preferredDoctor}</td>
                  <td className="border border-gray-300 px-4 py-2">{appointment.appointmentDateTime}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border border-gray-300 px-4 py-2 text-center">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewAppointments;