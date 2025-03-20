import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";

export default function MyBookings() {
    const [dataList, setDataList] = useState([]);

    const getAppoiments = async () => {

        try {
            const response = await axiosInstance.get("my/appointments");
            setDataList(response.data.data);
        } catch (error) {
            console.error("There was an error booking the appointment:", error);
        }
    }

    useEffect(() => {
        getAppoiments();
    }, [])

    return (
        <div className="mt-6 p-5">
            <h2 className="text-xl font-bold mb-5 text-center">Appointments List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            {["Full Name", "Date of Birth", "Gender", "Contact Number", "Email", "Preferred Doctor", "Appointment Date & Time"]
                                .map(header => <th key={header} >{header}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {dataList.length > 0 ? dataList.map((item, index) => (
                            <tr key={index} className="even:bg-gray-50">
                                <td className="py-2 px-4 ">{item.fullName}</td>
                                <td className="py-2 px-4 ">{item.dateOfBirth}</td>
                                <td className="py-2 px-4 ">{item.gender}</td>
                                <td className="py-2 px-4 ">{item.contactNumber}</td>
                                <td className="py-2 px-4 ">{item.email}</td>
                                <td className="py-2 px-4 ">{item.preferredDoctor}</td>
                                <td className="py-2 px-4 ">{item.appointmentDateTime}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500">No appointments available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}