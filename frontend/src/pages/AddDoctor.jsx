import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";

const AddDoctor = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      specialization: "",
      qualifications: [{ value: "" }],
      experience: "",
      consultationFee: "",
      phone: "",
      address: "",
      availability: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "qualifications",
  });

  const [serverMessage, setServerMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerMessage(null);

    // Transform and validate qualifications
    const qualifications = data.qualifications
      .map((q) => q.value)
      .filter((q) => q.trim() !== "");

    // Prevent submission if qualifications is empty
    if (qualifications.length === 0) {
      setServerMessage({
        type: "error",
        text: "At least one qualification is required.",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: data.name,
      email: data.email,
      specialization: data.specialization,
      qualifications,
      experience: Number(data.experience),
      consultationFee: Number(data.consultationFee),
      phone: data.phone,
      address: data.address,
      availability: data.availability,
    };

    // Log payload for debugging
    console.log("Payload:", payload);

    try {
      const response = await axios.post("http://localhost:5001/api/doctors", payload);
      setServerMessage({
        type: "success",
        text: response.data.message,
      });
      reset();
    } catch (error) {
      // Log full error for debugging
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.join(", ") ||
        "Failed to add doctor. Please try again.";
      setServerMessage({
        type: "error",
        text: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Doctor</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name", {
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Full name must be at least 2 characters",
              },
            })}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Dr. John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Invalid email address",
              },
            })}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="doctor@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Specialization */}
        <div>
          <label
            htmlFor="specialization"
            className="block text-sm font-medium text-gray-700"
          >
            Specialization
          </label>
          <input
            type="text"
            id="specialization"
            {...register("specialization", {
              required: "Specialization is required",
              minLength: {
                value: 2,
                message: "Specialization must be at least 2 characters",
              },
            })}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.specialization ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Cardiology"
          />
          {errors.specialization && (
            <p className="mt-1 text-sm text-red-600">
              {errors.specialization.message}
            </p>
          )}
        </div>

        {/* Qualifications */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Qualifications
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center mt-1">
              <input
                type="text"
                {...register(`qualifications.${index}.value`, {
                  required: "Qualification is required",
                  minLength: {
                    value: 2,
                    message: "Qualification must be at least 2 characters",
                  },
                })}
                className={`block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.qualifications?.[index]?.value
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="MBBS, MD"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="ml-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              )}
              {errors.qualifications?.[index]?.value && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.qualifications[index].value.message}
                </p>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => append({ value: "" })}
            className="mt-2 text-indigo-600 hover:text-indigo-800 text-sm"
          >
            Add Qualification
          </button>
        </div>

        {/* Experience */}
        <div>
          <label
            htmlFor="experience"
            className="block text-sm font-medium text-gray-700"
          >
            Experience (Years)
          </label>
          <input
            type="number"
            id="experience"
            {...register("experience", {
              required: "Experience is required",
              min: {
                value: 0,
                message: "Experience cannot be negative",
              },
            })}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.experience ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="5"
          />
          {errors.experience && (
            <p className="mt-1 text-sm text-red-600">
              {errors.experience.message}
            </p>
          )}
        </div>

        {/* Consultation Fee */}
        <div>
          <label
            htmlFor="consultationFee"
            className="block text-sm font-medium text-gray-700"
          >
            Consultation Fee ($)
          </label>
          <input
            type="number"
            id="consultationFee"
            {...register("consultationFee", {
              required: "Consultation fee is required",
              min: {
                value: 0,
                message: "Consultation fee cannot be negative",
              },
            })}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.consultationFee ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="100"
          />
          {errors.consultationFee && (
            <p className="mt-1 text-sm text-red-600">
              {errors.consultationFee.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^\+?[1-9]\d{1,14}$/,
                message: "Invalid phone number format",
              },
            })}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="+1234567890"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            {...register("address", {
              required: "Address is required",
              minLength: {
                value: 5,
                message: "Address must be at least 5 characters",
              },
            })}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="123 Main St, City, Country"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Availability */}
        <div>
          <label
            htmlFor="availability"
            className="block text-sm font-medium text-gray-700"
          >
            Availability
          </label>
          <input
            type="text"
            id="availability"
            {...register("availability", {
              required: "Availability is required",
              minLength: {
                value: 5,
                message: "Availability must be at least 5 characters",
              },
            })}
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${
              errors.availability ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Mon-Fri, 9AM-5PM"
          />
          {errors.availability && (
            <p className="mt-1 text-sm text-red-600">
              {errors.availability.message}
            </p>
          )}
        </div>

        {/* Server Message */}
        {serverMessage && (
          <div
            className={`p-4 rounded-md ${
              serverMessage.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {serverMessage.text}
          </div>
        )}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Add Doctor"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;