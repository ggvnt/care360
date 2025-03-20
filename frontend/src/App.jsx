import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Common
import HomePage from "./components/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
// Auth
import LoginPage from "./pages/auth/LoginPage.jsx";
import SignUpPage from "./pages/auth/SignUpPage.jsx";
import { useAuthStore } from "./store/auth/useAuthStore";

//vishmitha
import SymptomCheckerPage from "./pages/vishmitha/SymptomCheckerPage.jsx";
import Appointments from "./pages/appointments/Appointments.jsx";
import MyBookings from "./pages/appointments/MyBookings.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); // Check the user's auth status on page load
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color="#36d7b7" />
      </div>
    );

  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/appoinments"
            element={!authUser ? <LoginPage /> : <Appointments />}
          />
          <Route
            path="/my-bookings"
            element={!authUser ? <LoginPage /> : <MyBookings />}
          />

          {/*vishmitha*/}
          <Route path="/symptomChecker" element={<SymptomCheckerPage />} />

        </Routes>
        <Toaster />
      </Router>
    </div>
  );
};

export default App;
