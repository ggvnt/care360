import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    phone: yup.string().required("Phone number is required"),
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

  // Combine selected days and time into the availability field
  useEffect(() => {
    if (
      selectedDays &&
      selectedTime &&
      selectedDays !== "Custom" &&
      selectedTime !== "Custom"
    ) {
      setValue("availability", `${selectedDays}, ${selectedTime}`);
    } else if (selectedDays === "Custom" || selectedTime === "Custom") {
      setValue("availability", watch("customAvailability"));
    } else {
      setValue("availability", "");
    }
  }, [selectedDays, selectedTime, setValue, watch]);

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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addQualification}
              className="mt-2 px-3 py-2 bg-indigo-600 text-white rounded-md"
            >
              Add Qualification
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