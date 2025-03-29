import React from "react";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
      <h3>{doctor.name}</h3>
      <p>Specialization: {doctor.specialization}</p>
      <Link to={`/doctors/${doctor._id}`}>View Details</Link>
    </div>
  );
};

export default DoctorCard;
