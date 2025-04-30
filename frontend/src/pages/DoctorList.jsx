import React, { useState, useEffect } from "react";
import { Link, Links } from "react-router-dom";
import axios from "axios"; // Import axios

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]); // State to store doctors
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch doctors from the backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/doctors");
        setDoctors(response.data); // Set doctors data
        setLoading(false); // Stop loading
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to fetch doctors. Please try again later.");
        setLoading(false); // Stop loading
      }
    };

    fetchDoctors();
  }, []);

  // Simulate Edit action
  const handleEdit = (id) => {
    console.log(`Edit doctor with ID: ${id}`);
    // Add logic to navigate to the edit page or open a modal
  };

  // Handle Delete action
  const handleDelete = async (id) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this doctor?");
    if (isConfirmed) {
      try {
        // Send DELETE request to the backend
        await axios.delete(`http://localhost:5001/api/doctors/${id}`);
        console.log(`Doctor with ID: ${id} deleted`);

        // Update the doctors list by removing the deleted doctor
        setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== id));
      } catch (err) {
        console.error("Error deleting doctor:", err);
        alert("Failed to delete doctor. Please try again.");
      }
    }
  };

  // Handle Report Generation
  const handleGenerateReport = () => {
    // Convert doctors data to CSV format
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Name,Email,Specialization,Availability\n" +
      doctors
        .map(
          (doctor) =>
            `${doctor.name},${doctor.email},${doctor.specialization},${doctor.availability}`
        )
        .join("\n");

    // Create a temporary anchor element to trigger the download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "doctors_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Display loading state
  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  // Display error state
  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Doctor List</h1>
        <div className="flex justify-end mb-4">
          <button
            onClick={handleGenerateReport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
          >
            Generate Report
          </button>
        </div>
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Dr. {doctor.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.specialization}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.availability}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      to={`/edit-doctor/${doctor._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(doctor._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/add-doctor"
            className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
          >
            Add New Doctor
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;