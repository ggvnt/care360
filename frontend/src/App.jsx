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

//Admin
import AdminPage from "./pages/admins/AdminPage.jsx";
import SymptomsPage from "./pages/admins/SymptomsPage.jsx";

//vishmitha
import SymptomCheckerPage from "./pages/vishmitha/SymptomCheckerPage.jsx";

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

          {/*vishmitha*/}
          <Route path="/symptomChecker" element={<SymptomCheckerPage />} />

          {/* Admin-only route */}
          <Route
            path="/admin/dashboard"
            element={
              authUser?.role === "admin" ? <AdminPage /> : <Navigate to="/" />
            }
          />
          <Route
            path="/admin/symptoms"
            element={
              authUser?.role === "admin" ? (
                <SymptomsPage />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
};

export default App;
