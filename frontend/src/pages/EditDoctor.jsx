import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Define validation schema using yup
const doctorSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  specialization: yup.string().required("Specialization is required"),
  availability: yup.string().required("Availability is required"),
});

const EditDoctor = () => {
  const { id } = useParams(); // Get the doctor ID from the URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(doctorSchema),
  });

  const daysOptions = ["Mon-Fri", "Mon-Sun", "Mon-Wed", "Thu-Sat", "Custom"];
  const timeOptions = [
    "9 AM - 5 PM",
    "10 AM - 6 PM",
    "8 AM - 4 PM",
    "12 PM - 8 PM",
    "Custom",
  ];

  const selectedDays = watch("days", "");
  const selectedTime = watch("time", "");

  // Fetch doctor data by ID
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/doctors/${id}`);
        const doctor = response.data;

        // Set form values with fetched doctor data
        setValue("name", doctor.name);
        setValue("email", doctor.email);
        setValue("specialization", doctor.specialization);

        // Split availability into days and time
        const [days, time] = doctor.availability.split(", ");
        setValue("days", days);
        setValue("time", time);

        setLoading(false); // Stop loading
      } catch (err) {
        console.error("Error fetching doctor:", err);
        setError("Failed to fetch doctor details. Please try again later.");
        setLoading(false); // Stop loading
      }
    };

    fetchDoctor();
  }, [id, setValue]);

  // Combine selected days and time into the availability field
  useEffect(() => {
    if (selectedDays && selectedTime && selectedDays !== "Custom" && selectedTime !== "Custom") {
      setValue("availability", `${selectedDays}, ${selectedTime}`);
    } else if (selectedDays === "Custom" || selectedTime === "Custom") {
      setValue("availability", watch("customAvailability"));
    } else {
      setValue("availability", "");
    }
  }, [selectedDays, selectedTime, setValue, watch]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      // Send PUT request to update the doctor
      const response = await axios.put(`http://localhost:5001/api/doctors/${id}`, data);
      console.log("Doctor updated successfully:", response.data);

      // Redirect to the doctors list page after successful update
      navigate("/doctors");
    } catch (err) {
      console.error("Error updating doctor:", err);

      // Display error message to the user
      if (err.response) {
        alert(`Error: ${err.response.data.message}`);
      } else {
        alert("An error occurred while updating the doctor. Please try again.");
      }
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    navigate("/doctors"); // Redirect to the doctors list page
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Doctor</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              {...register("name")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              {...register("email")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization:</label>
            <select
              {...register("specialization")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.specialization ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            >
              <option value="">Select Specialization</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Neurology">Neurology</option>
              <option value="Oncology">Oncology</option>
              <option value="Gynecology">Gynecology</option>
              <option value="Radiology">Radiology</option>
              <option value="General Medicine">General Medicine</option>
            </select>
            {errors.specialization && (
              <p className="text-red-500 text-sm mt-1">{errors.specialization.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Availability:</label>
            <div className="flex gap-2">
              <select
                {...register("days")}
                className={`mt-1 block w-1/2 px-3 py-2 border ${
                  errors.availability ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Select Days</option>
                {daysOptions.map((day, index) => (
                  <option key={index} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              <select
                {...register("time")}
                className={`mt-1 block w-1/2 px-3 py-2 border ${
                  errors.availability ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              >
                <option value="">Select Time</option>
                {timeOptions.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            {(selectedDays === "Custom" || selectedTime === "Custom") && (
              <input
                type="text"
                placeholder="Enter custom availability"
                {...register("customAvailability")}
                className={`mt-2 block w-full px-3 py-2 border ${
                  errors.availability ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              />
            )}
            {errors.availability && (
              <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>
            )}
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Doctor
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctor;