import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DoctorDetails = () => {
  const [doctor, setDoctor] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/api/doctors/${id}`)
      .then((response) => {
        setDoctor(response.data);
      })
      .catch((error) => console.log(error));
  }, [id]);

  if (!doctor) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{doctor.name}</h1>
      <p>Email: {doctor.email}</p>
      <p>Specialization: {doctor.specialization}</p>
      <p>Availability: {doctor.availability}</p>
    </div>
  );
};

export default DoctorDetails;
