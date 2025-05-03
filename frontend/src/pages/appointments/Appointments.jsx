import { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { useAuthStore } from "../../store/auth/useAuthStore";
import toast from "react-hot-toast";

export default function Appointments() {
    const { authUser } = useAuthStore();
    const appointmentObj = {
        fullName: "",
        dateOfBirth: "",
        gender: "Other",
        contactNumber: "",
        email: "",
        preferredDoctor: "",
        appointmentDate: "",
        timeSlot: "",
    };
    const [formData, setFormData] = useState(appointmentObj);
    const [errors, setErrors] = useState({});
    const [doctors, setDoctors] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);

    // Fetch doctors from the backend
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axiosInstance.get("/appointments/get-doctors");
                setDoctors(response.data.data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
                toast.error("Failed to load doctors. Please try again.");
            }
        };

        fetchDoctors();
    }, []);

    // Fetch available slots when a date is selected
    const fetchAvailableSlots = async (doctor, date) => {
        if (!doctor || !date) return; // Ensure both doctor and date are provided
        try {
            const response = await axiosInstance.post(`/appointments/get-available-slots`, {
                doctor,
                date,
            });
            console.log("Available slots response:", response.data); // Debugging
            setAvailableSlots(response.data.slots); // Update available slots
        } catch (error) {
            console.error("Error fetching available slots:", error);
            toast.error("Failed to load available slots. Please try again.");
        }
    };
    
    useEffect(() => {
        console.log("Available slots updated:", availableSlots);
    }, [availableSlots]);

    const validate = () => {
        let newErrors = {};
        if (formData.fullName.length < 3) {
            newErrors.fullName = "Name must be at least 3 characters long";
        }
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of Birth is required";
        } else if (new Date(formData.dateOfBirth) >= new Date()) {
            newErrors.dateOfBirth = "Date of Birth must be in the past";
        }
        if (!formData.contactNumber) {
            newErrors.contactNumber = "Contact Number is required";
        } else if (!/^\d{10}$/.test(formData.contactNumber)) {
            newErrors.contactNumber = "Enter a 10-digit number";
        }
        if (formData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.preferredDoctor) {
            newErrors.preferredDoctor = "Preferred Doctor is required";
        }
        if (!formData.appointmentDate) {
            newErrors.appointmentDate = "Appointment date is required";
        }
        if (!formData.timeSlot) {
            newErrors.timeSlot = "Time slot is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    
        // Fetch available slots when doctor or date changes
        if (name === "preferredDoctor" || name === "appointmentDate") {
            const doctor = name === "preferredDoctor" ? value : formData.preferredDoctor;
            const date = name === "appointmentDate" ? value : formData.appointmentDate;
    
            // Only fetch slots if both doctor and date are selected
            if (doctor && date) {
                fetchAvailableSlots(doctor, date);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const appointmentData = {
                    ...formData,
                    userId: authUser._id, // Add userId from authUser
                };
                console.log("Submitting form data:", appointmentData); // Debugging
                const response = await axiosInstance.post("/appointments/create", appointmentData);
                setFormData(appointmentObj);
                toast.success("Appointment booked successfully!");
            } catch (error) {
                console.error("There was an error booking the appointment:", error);
                toast.error("Failed to book the appointment. Please try again.");
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
                <h2 className="text-xl font-bold mb-4 text-center">Doctor Appointment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {[{ label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name" },
                      { label: "Date of Birth", name: "dateOfBirth", type: "date" },
                      { label: "Contact Number", name: "contactNumber", type: "text", placeholder: "Enter a 10-digit number" },
                      { label: "Email", name: "email", type: "email", placeholder: "Enter your email" }]
                      .map(({ label, name, type, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700">{label}</label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
                            />
                            {errors[name] && <span className="text-red-500 text-sm">{errors[name]}</span>}
                        </div>
                    ))}

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Preferred Doctor</label>
                        <select
                            name="preferredDoctor"
                            value={formData.preferredDoctor}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
                        >
                            <option value="">Select a doctor</option>
                            {doctors.map((doctor) => (
                                <option key={doctor._id} value={doctor.fullName}>
                                    {doctor.fullName} - {doctor.specialization}
                                </option>
                            ))}
                        </select>
                        {errors.preferredDoctor && <span className="text-red-500 text-sm">{errors.preferredDoctor}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Appointment Date</label>
                        <input
                            type="date"
                            name="appointmentDate"
                            value={formData.appointmentDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split("T")[0]} // Restrict to future dates
                            className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
                        />
                        {errors.appointmentDate && <span className="text-red-500 text-sm">{errors.appointmentDate}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Available Time Slot</label>
                        <select
                            name="timeSlot"
                            value={formData.timeSlot}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300"
                        >
                            <option value="">Select a time slot</option>
                            {availableSlots.map((slot, index) => (
                                <option key={index} value={slot}>
                                    {slot}
                                </option>
                            ))}
                        </select>
                        {errors.timeSlot && <span className="text-red-500 text-sm">{errors.timeSlot}</span>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} 
                               className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-300">
                               <option value="Male">Male</option>
                               <option value="Female">Female</option>
                               <option value="Other">Other</option>
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-green-500 text-white px-4 py-2 rounded-lg">
                        Book Appointment
                    </button>
                </form>
            </div>
        </div>
    );
}