import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  specialization: yup.string().required("Specialization is required"),
  availability: yup.string().required("Availability is required"),
});

const EditDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    axios.get(`http://localhost:5001/api/doctors/${id}`)
      .then(({ data }) => {
        setValue("name", data.name);
        setValue("email", data.email);
        setValue("specialization", data.specialization);
        setValue("availability", data.availability || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch doctor details.");
        setLoading(false);
      });
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:5001/api/doctors/${id}`, data);
      navigate("/doctors");
    } catch {
      alert("Error updating doctor.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Doctor</h2>

        <input {...register("name")} placeholder="Name" className="input" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input {...register("email")} type="email" placeholder="Email" className="input" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input {...register("specialization")} placeholder="Specialization" className="input" />
        {errors.specialization && <p className="text-red-500">{errors.specialization.message}</p>}

        <input {...register("availability")} placeholder="Availability" className="input" />
        {errors.availability && <p className="text-red-500">{errors.availability.message}</p>}

        <div className="flex gap-2 mt-4">
          <button type="submit" className="btn-primary">Update</button>
          <button type="button" onClick={() => navigate("/doctors")} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditDoctor;
