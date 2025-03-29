import React from "react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="min-h-screen flex flex-col  bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="space-y-4">
        <Link
          to="/admin/symptoms"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600"
        >
          Symptom Management
        </Link>
      </div>
    </div>
  );
};

export default AdminPage;
