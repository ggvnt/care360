import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function MyBookings() {
    const [dataList, setDataList] = useState([]);
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

    const getAppoiments = async () => {
        try {
            const response = await axiosInstance.get("my/appointments");
            setDataList(response.data.data);
        } catch (error) {
            console.error("There was an error booking the appointment:", error);
        }
    };

    const deleteAppointment = async (id) => {
        try {
            await axiosInstance.delete(`my/appointments/${id}`);
            setDataList(dataList.filter(item => item._id !== id));
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
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const updateAppointment = async (id) => {
        try {
            const response = await axiosInstance.put(`my/appointments/${id}`, formData);

            // Update the dataList with the updated appointment
            setDataList(dataList.map(item =>
                item._id === id ? response.data.data : item
            ));

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
        } catch (error) {
            console.error("Error updating appointment:", error);
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
    };

    useEffect(() => {
        getAppoiments();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Appointments List</h1>

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
                        {dataList.length > 0 ? dataList.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                                {editingAppointment === item._id ? (
                                    <>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full p-1 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleInputChange}
                                                className="w-full p-1 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleInputChange}
                                                className="w-full p-1 border rounded"
                                            >
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="text"
                                                name="contactNumber"
                                                value={formData.contactNumber}
                                                onChange={handleInputChange}
                                                className="w-full p-1 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full p-1 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="text"
                                                name="preferredDoctor"
                                                value={formData.preferredDoctor}
                                                onChange={handleInputChange}
                                                className="w-full p-1 border rounded"
                                            />
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-200">
                                            <input
                                                type="datetime-local"
                                                name="appointmentDateTime"
                                                value={formData.appointmentDateTime}
                                                onChange={handleInputChange}
                                                className="w-full p-1 border rounded"
                                            />
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
                                    No appointments available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}