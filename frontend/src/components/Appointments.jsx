import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/auth/useAuthStore";
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
        appointmentDateTime: new Date(),
    };
    const [formData, setFormData] = useState(appointmentObj);
    const [errors, setErrors] = useState({});
    const [doctors, setDoctors] = useState([]); // State to store the list of doctors

    // Fetch doctors from the backend
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axiosInstance.get("/my/appointments/get-doctors"); // Call the backend API
                setDoctors(response.data.data); // Set the fetched doctors in state
            } catch (error) {
                console.error("Error fetching doctors:", error);
                toast.error("Failed to load doctors. Please try again.");
            }
        };

        fetchDoctors();
    }, []);

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
        if (!formData.appointmentDateTime) {
            newErrors.appointmentDateTime = "Appointment date & time is required";
        } else if (new Date(formData.appointmentDateTime) <= new Date()) {
            newErrors.appointmentDateTime = "Appointment date must be in the future";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        console.log(formData);
        
        e.preventDefault();
        if (validate()) {
            try {
                const response = await axiosInstance.post("my/appointments/create", formData);
                setFormData(appointmentObj);
                toast.success("Appointment booked successfully!");
                // setAddSection(false);
            } catch (error) {
                console.error("There was an error booking the appointment:", error);
            }
        }
    };

    const formatDateTimeForInput = (date) => {
        if (!date) return ''; // Ensure null or undefined don't break the format
    
        const d = new Date(date);
        const pad = (num) => (num < 10 ? '0' + num : num);
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      };

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
                    <img src="../public/images/doctor-default.gif" className="mx-auto mb-3" alt="" />
                    <h2 className="text-xl font-bold mb-4 text-center">Doctor Appointment</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {[
                            { label: "Full Name", name: "fullName", type: "text", placeholder: "Enter your full name" },
                            { label: "Date of Birth", name: "dateOfBirth", type: "date" },
                            { label: "Contact Number", name: "contactNumber", type: "text", placeholder: "Enter a 10-digit number" },
                            { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
                            { label: "Appointment Date & Time", name: "appointmentDateTime", type: "datetime-local" }
                        ].map(({ label, name, type, placeholder }) => (
                            <div key={name}>
                                <label className="block text-sm font-medium text-gray-700">{label}</label>
                                <input 
                                    type={type} 
                                    name={name} 
                                    value={name === 'appointmentDateTime' ? formatDateTimeForInput(formData.appointmentDateTime) : formData[name]} 
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
                                {/* {doctors.map((doctor) => (
                                    <option key={doctor._id} value={doctor.name}>
                                        {doctor.name} - {doctor.specialization}
                                    </option>
                                ))} */}
                                 <option value="doc1">Eshani Nanayakkaara</option>
                                 <option value="doc2">Gamini Gunathilaka</option>
                                 <option value="doc3">Rathna Pradeepa</option>
                            </select>
                            {errors.preferredDoctor && <span className="text-red-500 text-sm">{errors.preferredDoctor}</span>}
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