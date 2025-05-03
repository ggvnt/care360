import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Calendar, Clock, Trash2, Plus } from "lucide-react";

// Define validation schema using yup
const doctorSchema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  specialization: yup.string().required("Specialization is required"),
  qualifications: yup
    .array()
    .of(yup.string().required("Qualification is required"))
    .min(1, "At least one qualification is required")
    .required("Qualifications are required"),
  experience: yup
    .number()
    .typeError("Experience must be a number")
    .min(0, "Experience cannot be negative")
    .required("Experience is required"),
  consultationFee: yup
    .number()
    .typeError("Consultation fee must be a number")
    .min(0, "Consultation fee cannot be negative")
    .required("Consultation fee is required"),
  contactInfo: yup.object().shape({
    phone: yup
      .string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    address: yup.string().required("Address is required"),
  }),
  availability: yup.string().required("Availability is required"),
});

const AddDoctor = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(doctorSchema),
    defaultValues: {
      qualifications: [""],
      availabilitySchedule: [],
    }
  });

  // State for availability scheduling
  const [availabilitySchedule, setAvailabilitySchedule] = useState([]);
  const [newScheduleItem, setNewScheduleItem] = useState({
    day: "",
    startTime: "",
    endTime: "",
    date: "",
  });
  const [scheduleType, setScheduleType] = useState("weekly"); // "weekly" or "specific"

  // Days of the week for weekly schedule
  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  // Handle dynamic qualifications array
  const qualifications = watch("qualifications", [""]);

  const addQualification = () => {
    setValue("qualifications", [...qualifications, ""]);
  };

  const removeQualification = (index) => {
    const updatedQualifications = qualifications.filter((_, i) => i !== index);
    setValue("qualifications", updatedQualifications);
  };

  const updateQualification = (index, value) => {
    const updatedQualifications = [...qualifications];
    updatedQualifications[index] = value;
    setValue("qualifications", updatedQualifications);
  };

  // Handle schedule type change
  const handleScheduleTypeChange = (type) => {
    setScheduleType(type);
    setAvailabilitySchedule([]);
    setNewScheduleItem({
      day: "",
      startTime: "",
      endTime: "",
      date: "",
    });
  };

  // Add new availability slot
  const addAvailabilitySlot = () => {
    // Validate the new schedule item
    if (scheduleType === "weekly" && (!newScheduleItem.day || !newScheduleItem.startTime || !newScheduleItem.endTime)) {
      alert("Please select day, start time and end time");
      return;
    }
    
    if (scheduleType === "specific" && (!newScheduleItem.date || !newScheduleItem.startTime || !newScheduleItem.endTime)) {
      alert("Please select date, start time and end time");
      return;
    }

    // Add to schedule
    const updatedSchedule = [...availabilitySchedule, {...newScheduleItem}];
    setAvailabilitySchedule(updatedSchedule);
    
    // Reset form for next entry
    setNewScheduleItem({
      day: "",
      startTime: "",
      endTime: "",
      date: "",
    });
    
    // Update the availability field for form submission
    updateAvailabilityValue(updatedSchedule);
  };

  // Remove availability slot
  const removeAvailabilitySlot = (index) => {
    const updatedSchedule = availabilitySchedule.filter((_, i) => i !== index);
    setAvailabilitySchedule(updatedSchedule);
    updateAvailabilityValue(updatedSchedule);
  };

  // Update availability string for form submission
  const updateAvailabilityValue = (schedule) => {
    if (schedule.length === 0) {
      setValue("availability", "");
      return;
    }

    // Format the schedule into a string
    const formattedSchedule = schedule.map(slot => {
      if (scheduleType === "weekly") {
        return `${slot.day}: ${slot.startTime} - ${slot.endTime}`;
      } else {
        return `${slot.date}: ${slot.startTime} - ${slot.endTime}`;
      }
    }).join("; ");

    setValue("availability", formattedSchedule);
  };

  const onSubmit = async (data) => {
    try {
      // Send POST request to the backend API
      const response = await axios.post("http://localhost:5001/api/doctors", data);
      console.log("Doctor added successfully:", response.data);

      // Redirect to the doctors list page after successful submission
      navigate("/doctors");
    } catch (error) {
      console.error("Error adding doctor:", error);

      // Display error message to the user
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert("An error occurred while adding the doctor. Please try again.");
      }
    }
  };

  const handleCancel = () => {
    navigate("/doctors"); // Redirect to the doctors list page
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Add Doctor</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name:</label>
            <input
              type="text"
              {...register("fullName")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
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
            <label className="block text-sm font-medium text-gray-700">Qualifications:</label>
            {qualifications.map((qual, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={qual}
                  onChange={(e) => updateQualification(index, e.target.value)}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.qualifications?.[index] ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder={`Qualification ${index + 1}`}
                />
                {qualifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQualification(index)}
                    className="mt-1 px-3 py-2 bg-red-500 text-white rounded-md"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addQualification}
              className="mt-2 px-3 py-2 bg-indigo-600 text-white rounded-md flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Qualification
            </button>
            {errors.qualifications && (
              <p className="text-red-500 text-sm mt-1">{errors.qualifications.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (Years):</label>
            <input
              type="number"
              {...register("experience")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.experience ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.experience && (
              <p className="text-red-500 text-sm mt-1">{errors.experience.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Consultation Fee ($):</label>
            <input
              type="number"
              {...register("consultationFee")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.consultationFee ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.consultationFee && (
              <p className="text-red-500 text-sm mt-1">{errors.consultationFee.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
            <input
              type="text"
              {...register("contactInfo.phone")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.contactInfo?.phone ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.contactInfo?.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.contactInfo.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address:</label>
            <input
              type="text"
              {...register("contactInfo.address")}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.contactInfo?.address ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            />
            {errors.contactInfo?.address && (
              <p className="text-red-500 text-sm mt-1">{errors.contactInfo.address.message}</p>
            )}
          </div>
          
          {/* Availability Section with Calendar */}
          <div className="border border-gray-200 rounded-md p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability Schedule:</label>
            
            {/* Schedule Type Selector */}
            <div className="flex gap-4 mb-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="scheduleType"
                  checked={scheduleType === "weekly"}
                  onChange={() => handleScheduleTypeChange("weekly")}
                  className="h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-sm">Weekly Schedule</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="scheduleType"
                  checked={scheduleType === "specific"}
                  onChange={() => handleScheduleTypeChange("specific")}
                  className="h-4 w-4 text-indigo-600"
                />
                <span className="ml-2 text-sm">Specific Dates</span>
              </label>
            </div>
            
            {/* Add New Availability UI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
              {scheduleType === "weekly" ? (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Day</label>
                  <select
                    value={newScheduleItem.day}
                    onChange={(e) => setNewScheduleItem({...newScheduleItem, day: e.target.value})}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Day</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      min={today}
                      value={newScheduleItem.date}
                      onChange={(e) => setNewScheduleItem({...newScheduleItem, date: e.target.value})}
                      className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Start Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    value={newScheduleItem.startTime}
                    onChange={(e) => setNewScheduleItem({...newScheduleItem, startTime: e.target.value})}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">End Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    value={newScheduleItem.endTime}
                    onChange={(e) => setNewScheduleItem({...newScheduleItem, endTime: e.target.value})}
                    className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={addAvailabilitySlot}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Slot
              </button>
            </div>
            
            {/* Display Added Availability Slots */}
            {availabilitySchedule.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Scheduled Availability:</h3>
                <div className="bg-gray-50 rounded-md p-3 max-h-40 overflow-y-auto">
                  {availabilitySchedule.map((slot, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-sm">
                        {scheduleType === "weekly" 
                          ? `${slot.day}: ${slot.startTime} - ${slot.endTime}`
                          : `${new Date(slot.date).toLocaleDateString()}: ${slot.startTime} - ${slot.endTime}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAvailabilitySlot(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hidden input for availability value */}
            <input type="hidden" {...register("availability")} />
            {errors.availability && (
              <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>
            )}
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Doctor
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

export default AddDoctor;