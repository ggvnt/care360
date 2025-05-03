import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Clock, Mail, Award, Calendar, MapPin, Phone, User } from "lucide-react";
import DoctorImg from "../assets/doctorImg.png"

const DoctorDetails = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5001/api/doctors/${id}`)
      .then((response) => {
        setDoctor(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to load doctor details");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-blue-600 font-medium">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg shadow-md">
          <h2 className="text-red-600 text-xl font-bold mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 py-6 px-6 md:px-8">
          <h1 className="text-white text-2xl md:text-3xl font-bold">Doctor Profile</h1>
        </div>
        
        <div className="md:flex">
          <div className="md:w-1/3 bg-blue-50 p-6 flex flex-col items-center justify-start">
            <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 mb-4 border-4 border-blue-500">
              <img 
                src={DoctorImg} 
                alt="Doctor profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-blue-800 text-center">{doctor.fullName}</h2>
            <p className="text-blue-600 font-medium text-center mb-4">{doctor.specialization}</p>
            
            <div className="w-full bg-white rounded-lg shadow-sm p-4 mt-4">
              <h3 className="font-medium text-blue-800 mb-2 flex items-center">
                <Clock size={18} className="mr-2 text-blue-500" />
                Availability
              </h3>
              <p className="text-gray-700 pl-6">{doctor.availability}</p>
            </div>
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="bg-blue-50 p-5 rounded-lg shadow-sm mb-6">
              <h3 className="font-bold text-blue-800 mb-4 text-lg">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Mail size={18} className="mr-3 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-700">{doctor.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone size={18} className="mr-3 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-700">{doctor.phone || "Not available"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin size={18} className="mr-3 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-700">{doctor.location || "Main Hospital"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User size={18} className="mr-3 text-blue-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="text-gray-700">{doctor.experience || "5+ years"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white border border-blue-100 rounded-lg p-5 mb-6">
              <h3 className="font-bold text-blue-800 mb-4 text-lg flex items-center">
                <Award size={18} className="mr-2 text-blue-500" />
                Expertise & Qualifications
              </h3>
              <ul className="pl-6 list-disc text-gray-700 space-y-2">
                {doctor.qualifications ? 
                  doctor.qualifications.map((qual, index) => (
                    <li key={index}>{qual}</li>
                  )) : 
                  <>
                    <li>{doctor.specialization} Specialist</li>
                    <li>Board Certified</li>
                    <li>Medical Degree from University Medical School</li>
                  </>
                }
              </ul>
            </div>
            
            <div className="bg-white border border-blue-100 rounded-lg p-5">
              <h3 className="font-bold text-blue-800 mb-4 text-lg flex items-center">
                <Calendar size={18} className="mr-2 text-blue-500" />
                Schedule Appointment
              </h3>
              <div className="text-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors">
                  Book an Appointment
                </button>
                <p className="text-gray-500 mt-2 text-sm">
                  Appointments available based on doctor's schedule
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;