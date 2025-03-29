import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const DoctorDashboard = () => {
  const [doctorCount, setDoctorCount] = useState(0);

  useEffect(() => {
    axios.get("/api/doctors/count")
      .then((response) => {
        setDoctorCount(response.data.count);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      <h1>Doctor Dashboard</h1>
      <p>Total Doctors: {doctorCount}</p>
      <Link to="/doctors">View All Doctors</Link>
    </div>
  );
};

export default DoctorDashboard;
