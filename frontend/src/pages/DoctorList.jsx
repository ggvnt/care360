import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, Filter, X } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    specialization: "",
    availability: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Specialization options (can be fetched from API in real implementation)
  const specializationOptions = [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Dermatology",
    "Orthopedics",
    "General Medicine"
  ];
  
  // Availability options
  const availabilityOptions = [
    "Weekdays",
    "Weekends",
    "Evenings",
    "Morning",
    "24/7"
  ];

  // Fetch doctors from the backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/doctors");
        setDoctors(response.data);
        setFilteredDoctors(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to fetch doctors. Please try again later.");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Apply search and filters when changed
  useEffect(() => {
    let results = doctors;
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        doctor => 
          doctor.fullName?.toLowerCase().includes(term) || 
          doctor.email?.toLowerCase().includes(term) ||
          doctor.specialization?.toLowerCase().includes(term)
      );
    }
    
    // Apply specialization filter
    if (filters.specialization) {
      results = results.filter(
        doctor => doctor.specialization === filters.specialization
      );
    }
    
    // Apply availability filter
    if (filters.availability) {
      results = results.filter(
        doctor => doctor.availability === filters.availability
      );
    }
    
    setFilteredDoctors(results);
  }, [searchTerm, filters, doctors]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      specialization: "",
      availability: ""
    });
  };

  // Simulate Edit action
  const handleEdit = (id) => {
    console.log(`Edit doctor with ID: ${id}`);
  };

  // Handle Delete action
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this doctor?");
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5001/api/doctors/${id}`);
        console.log(`Doctor with ID: ${id} deleted`);
        setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== id));
      } catch (err) {
        console.error("Error deleting doctor:", err);
        alert("Failed to delete doctor. Please try again.");
      }
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF();
  
    // Header
    doc.setFontSize(18);
    doc.setTextColor(41, 98, 255);
    doc.text("Doctor Report", 20, 20);
  
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, 30);
  
    // Define columns and rows
    const tableColumn = ["Name", "Email", "Specialization", "Availability"];
    const tableRows = filteredDoctors.map((doctor) => [
      doctor.fullName,
      doctor.email,
      doctor.specialization,
      doctor.availability,
    ]);
  
    // Generate table
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 98, 255] }
    });
  
    // Save PDF
    doc.save("doctor_report.pdf");
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
        
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            {/* Search Bar */}
            <div className="relative flex-1 mb-4 md:mb-0 md:mr-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by name, email or specialization..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <div className="flex items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters {showFilters ? '▲' : '▼'}
              </button>
              
              {(filters.specialization || filters.availability) && (
                <button
                  onClick={resetFilters}
                  className="ml-2 inline-flex items-center px-2 py-1 border border-transparent rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </button>
              )}
              
              <button
                onClick={handleGenerateReport}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
              >
                Generate Report
              </button>
            </div>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              {/* Specialization Filter */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select
                  id="specialization"
                  value={filters.specialization}
                  onChange={(e) => handleFilterChange("specialization", e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Specializations</option>
                  {specializationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              {/* Availability Filter */}
              <div>
                <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
                  Availability
                </label>
                <select
                  id="availability"
                  value={filters.availability}
                  onChange={(e) => handleFilterChange("availability", e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Availability</option>
                  {availabilityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          
          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredDoctors.length} of {doctors.length} doctors
          </div>
        </div>
        
        {/* Doctors Table */}
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
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                        to={`/DoctorDetails/${doctor._id}`}
                        className="text-blue-600 hover:text-indigo-900 mr-4"
                      >
                        View
                      </Link>
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No doctors found matching your search criteria.
                    <button 
                      onClick={resetFilters} 
                      className="ml-2 text-indigo-600 hover:text-indigo-900"
                    >
                      Reset filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Add Doctor Button */}
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