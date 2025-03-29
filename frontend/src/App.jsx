import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import DoctorDashboard from "./pages/DoctorDashboard";
import AddDoctor from "./pages/AddDoctor";
import DoctorList from "./pages/DoctorList";
import DoctorDetails from "./pages/DoctorDetails";
import EditDoctor from "./pages/EditDoctor";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Redirect to dashboard */}
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/doctors" element={<DoctorList />} />
        <Route path="/edit-doctor/:id" element={<EditDoctor/>} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
