import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { axiosInstance } from "../../lib/axios";
import jsPDF from "jspdf"; // Import jsPDF
import "jspdf-autotable"; // Import autotable plugin for table generation

const ReviewAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch all appointments when the component loads
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/appointments");
        // Safeguard to ensure response.data exists
        const fetchedAppointments = response?.data || [];
        setAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const generateReport = () => {
    const doc = new jsPDF("landscape", "mm", "a4");
  
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 4;
    const rowHeight = 10;
    const startY = 30;
    let yPosition = startY;
  
    // Title
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("Appointments Report", margin, 20);
  
    // Table headers and their widths
    const headers = [
      "#",
      "Full Name",
      "Email",
      "Gender",
      "Contact Number",
      "Date of Birth",
      "Preferred Doctor",
      "Appointment Date",
      "Time Slot",
    ];
    const columnWidths = [10, 40, 50, 20, 35, 30, 45, 35, 25];
  
    // Draw header background
    doc.setFillColor(41, 128, 185); // Blue
    doc.setTextColor(255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
  
    let xPosition = margin;
    headers.forEach((header, i) => {
      doc.rect(xPosition, yPosition, columnWidths[i], rowHeight, "F"); // Filled rect
      doc.text(header, xPosition + 2, yPosition + 7);
      xPosition += columnWidths[i];
    });
  
    yPosition += rowHeight;
  
    // Reset font for body
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);
  
    appointments.forEach((appointment, rowIndex) => {
      xPosition = margin;
  
      const row = [
        rowIndex + 1,
        appointment.fullName,
        appointment.email,
        appointment.gender,
        appointment.contactNumber,
        appointment.dateOfBirth,
        appointment.preferredDoctor,
        appointment.appointmentDate,
        appointment.timeSlot,
      ];
  
      // Draw row
      row.forEach((cell, colIndex) => {
        doc.rect(xPosition, yPosition, columnWidths[colIndex], rowHeight);
        doc.text(String(cell), xPosition + 2, yPosition + 7);
        xPosition += columnWidths[colIndex];
      });
  
      yPosition += rowHeight;
  
      // Page break
      if (yPosition + rowHeight > doc.internal.pageSize.getHeight() - 10) {
        doc.addPage();
        yPosition = margin;
  
        // Redraw headers on new page
        xPosition = margin;
        doc.setFillColor(41, 128, 185);
        doc.setTextColor(255);
        doc.setFont("helvetica", "bold");
  
        headers.forEach((header, i) => {
          doc.rect(xPosition, yPosition, columnWidths[i], rowHeight, "F");
          doc.text(header, xPosition + 2, yPosition + 7);
          xPosition += columnWidths[i];
        });
  
        yPosition += rowHeight;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(0);
      }
    });
  
    doc.save("appointments_report.pdf");
  };
  

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
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-auto"
          onClick={generateReport} // Call generateReport on click
        >
          Generate Report
        </button>
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
              <th className="border border-gray-300 px-4 py-2">Appointment Date</th>
              <th className="border border-gray-300 px-4 py-2">Time Slot</th>
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
                  <td className="border border-gray-300 px-4 py-2">{appointment.appointmentDate}</td>
                  <td className="border border-gray-300 px-4 py-2">{appointment.timeSlot}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border border-gray-300 px-4 py-2 text-center">
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