import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth/useAuthStore";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { authUser, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Check authentication when Navbar loads
  }, [checkAuth]);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 shadow-md">
      {/* Logo */}
      <div
        className="flex items-center space-x-4 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/Images/wlogo.png" alt="Logo" className="w-12 h-10" />
        <span className="text-xl font-semibold text-white">Care360</span>
      </div>

      {/* Navigation Links */}
      <ul className="flex items-center space-x-6 font-medium text-white">
        <li
          className="hover:text-gray-200 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Home
        </li>
        <li
          className="hover:text-gray-200 cursor-pointer"
          onClick={() => navigate('/DoctorList')}
        >
          Doctors
        </li>
        <li
          className="hover:text-gray-200 cursor-pointer"
          onClick={() => navigate("/appointments")}
        >
          Appoinments
        </li>
        <li
          className="hover:text-gray-200 cursor-pointer"
          onClick={() => navigate("/my-bookings")}
        >
          My Bookings
        </li>
        <li
          className="hover:text-gray-200 cursor-pointer"
          onClick={() => navigate("/symptomChecker")}
        >
          Symptom Checker
        </li>
        <li
          className="hover:text-gray-200 cursor-pointer"
          onClick={() => navigate("/contact")}
        >
          Contact
        </li>
        <li
          className="hover:text-gray-200 cursor-pointer"
          onClick={() => navigate("/about")}
        >
          About
        </li>
      </ul>

      {/* User Profile or Login */}
      <div className="relative">
        {authUser ? (
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={toggleDropdown}
          >
            <img
              src="/Images/avatar.png"
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-300"
            />
            <span className="text-white">{authUser.name}</span>
          </div>
        ) : (
          <button
            className="px-4 py-2 text-blue-500 bg-white rounded-md hover:bg-blue-100"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}

        {/* Dropdown Menu */}
        {isDropdownOpen && authUser && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 w-48 mt-3 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-40"
          >
            <a
              href="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            {authUser.role === "admin" && (
              <a
                href="/admin/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Admin Dashboard
              </a>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-red-100"
            >
              Logout
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
