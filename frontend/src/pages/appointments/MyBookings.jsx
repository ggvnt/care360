import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";

export default function MyBookings() {
    const [dataList, setDataList] = useState([]);
    const [filteredDataList, setFilteredDataList] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingAppointment, setEditingAppointment] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        email: "",
        preferredDoctor: "",
        appointmentDateTime: ""
    });
    const [errors, setErrors] = useState({});

    const getAppoiments = async () => {
        try {
            const response = await axiosInstance.get("my/appointments");
            setDataList(response.data.data);
            setFilteredDataList(response.data.data);
        } catch (error) {
            console.error("There was an error fetching appointments:", error);
        }
    };

    // Filter function for search
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        
        if (!term.trim()) {
            setFilteredDataList(dataList);
            return;
        }
        
        const filtered = dataList.filter(item => 
            item.fullName.toLowerCase().includes(term) || 
            item.preferredDoctor.toLowerCase().includes(term)
        );
        
        setFilteredDataList(filtered);
    };

    const deleteAppointment = async (id) => {
        try {
            await axiosInstance.delete(`my/appointments/${id}`);
            const updatedList = dataList.filter(item => item._id !== id);
            setDataList(updatedList);
            setFilteredDataList(
                searchTerm.trim() ? 
                updatedList.filter(item => 
                    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    item.preferredDoctor.toLowerCase().includes(searchTerm.toLowerCase())
                ) : 
                updatedList
            );
        } catch (error) {
            console.error("Error deleting appointment:", error);
        }
    };

    const handleEditClick = (appointment) => {
        setEditingAppointment(appointment._id);
        setFormData({
            fullName: appointment.fullName,
            dateOfBirth: appointment.dateOfBirth,
            gender: appointment.gender,
            contactNumber: appointment.contactNumber,
            email: appointment.email,
            preferredDoctor: appointment.preferredDoctor,
            appointmentDateTime: appointment.appointmentDateTime
        });
        setErrors({});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ""
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        // Full Name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        } else if (formData.fullName.trim().length < 3) {
            newErrors.fullName = "Full name must be at least 3 characters";
        }
        
        // Date of Birth validation
        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "Date of birth is required";
        } else {
            const birthDate = new Date(formData.dateOfBirth);
            const today = new Date();
            if (birthDate > today) {
                newErrors.dateOfBirth = "Date of birth cannot be in the future";
            }
        }
        
        // Gender validation
        if (!formData.gender) {
            newErrors.gender = "Gender selection is required";
        }
        
        // Contact Number validation
        if (!formData.contactNumber) {
            newErrors.contactNumber = "Contact number is required";
        } else if (!/^\d{10,15}$/.test(formData.contactNumber.replace(/[-()\s]/g, ''))) {
            newErrors.contactNumber = "Please enter a valid contact number";
        }
        
        // Email validation
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        
        // Preferred Doctor validation
        if (!formData.preferredDoctor) {
            newErrors.preferredDoctor = "Preferred doctor is required";
        }
        
        // Appointment Date & Time validation
        if (!formData.appointmentDateTime) {
            newErrors.appointmentDateTime = "Appointment date and time is required";
        } else {
            const appointmentDate = new Date(formData.appointmentDateTime);
            const today = new Date();
            if (appointmentDate < today) {
                newErrors.appointmentDateTime = "Appointment time cannot be in the past";
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateAppointment = async (id) => {
        if (!validateForm()) {
            return;
        }
        
        try {
            const response = await axiosInstance.put(`my/appointments/${id}`, formData);
            const updatedAppointment = response.data.data;

            // Update the dataList with the updated appointment
            const updatedDataList = dataList.map(item =>
                item._id === id ? updatedAppointment : item
            );
            
            setDataList(updatedDataList);
            
            // Also update the filtered list
            setFilteredDataList(
                searchTerm.trim() ? 
                updatedDataList.filter(item => 
                    item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    item.preferredDoctor.toLowerCase().includes(searchTerm.toLowerCase())
                ) : 
                updatedDataList
            );

            // Reset editing state
            setEditingAppointment(null);
            setFormData({
                fullName: "",
                dateOfBirth: "",
                gender: "",
                contactNumber: "",
                email: "",
                preferredDoctor: "",
                appointmentDateTime: ""
            });
            setErrors({});
        } catch (error) {
            console.error("Error updating appointment:", error);
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    const cancelEdit = () => {
        setEditingAppointment(null);
        setFormData({
            fullName: "",
            dateOfBirth: "",
            gender: "",
            contactNumber: "",
            email: "",
            preferredDoctor: "",
            appointmentDateTime: ""
        });
        setErrors({});
    };

    useEffect(() => {
        getAppoiments();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Appointments List</h1>
                
                {/* Compact Search Bar */}
                <div className="w-64 relative">
                    <div className="flex items-center border rounded-md overflow-hidden bg-white shadow-sm">
                        <div className="pl-3 pr-1 text-gray-400">
                            <FaSearch size={14} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search name/doctor..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full py-2 px-2 text-sm focus:outline-none"
                        />
                        {searchTerm && (
                            <button 
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilteredDataList(dataList);
                                }}
                                className="pr-3 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            {["Full Name", "Date of Birth", "Gender", "Contact Number", "Email", "Preferred Doctor", "Appointment Date & Time", "Actions"]
                                .map((header, index) => (
                                    <th key={index} className="py-2 px-4 border-b border-gray-200 text-left">
                                        {header}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDataList && filteredDataList.length > 0 ? filteredDataList.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                {editingAppointment === item._id ? (
                                    <>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className={`w-full p-1 border rounded ${errors.fullName ? 'border-red-500' : ''}`}
                                            />
                                            {errors.fullName && (
                                                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange}
                                                className={`w-full p-1 border rounded ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                                            />
                                            {errors.dateOfBirth && (
                                                <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className={`w-full p-1 border rounded ${errors.gender ? 'border-red-500' : ''}`}
                                            >
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.gender && (
                                                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="text"
                                                name="contactNumber"
                                                value={formData.contactNumber}
                                                onChange={handleInputChange}
                                                className={`w-full p-1 border rounded ${errors.contactNumber ? 'border-red-500' : ''}`}
                                            />
                                            {errors.contactNumber && (
                                                <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full p-1 border rounded ${errors.email ? 'border-red-500' : ''}`}
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="text"
                                                name="preferredDoctor"
                                                value={formData.preferredDoctor}
                                                onChange={handleInputChange}
                                                className={`w-full p-1 border rounded ${errors.preferredDoctor ? 'border-red-500' : ''}`}
                                            />
                                            {errors.preferredDoctor && (
                                                <p className="text-red-500 text-xs mt-1">{errors.preferredDoctor}</p>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="datetime-local"
                                                name="appointmentDateTime"
                                                value={formData.appointmentDateTime}
                                                onChange={handleInputChange}
                                                className={`w-full p-1 border rounded ${errors.appointmentDateTime ? 'border-red-500' : ''}`}
                                            />
                                            {errors.appointmentDateTime && (
                                                <p className="text-red-500 text-xs mt-1">{errors.appointmentDateTime}</p>
                                            )}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <button
                                                onClick={() => updateAppointment(item._id)}
                                                className="bg-green-500 text-white p-1 rounded mr-2 w-20 text-center mb-2"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="bg-gray-500 text-white p-1 rounded w-20 text-center"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.fullName}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.dateOfBirth}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.gender}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.contactNumber}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.email}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.preferredDoctor}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">{item.appointmentDateTime}</td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="text-blue-500 mr-3"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm("Are you sure you want to delete this appointment?")) {
                                                        deleteAppointment(item._id)
                                                    }
                                                }}
                                                className="text-red-500"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="8" className="py-4 px-4 text-center border-b border-gray-200">
                                    {searchTerm ? "No matching appointments found" : "No appointments available"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}